import { connectDB } from "@/lib/mongo";
import User from "@/models/user.model";
import Order from "@/models/order.model";
import Product from "@/models/product.model";

type KPI = {
  totalUsers: number;
  totalOrders: number;
  totalProducts: number;
  totalRevenue: number;
  usersDeltaPct: number;
  ordersDeltaPct: number;
  revenueDeltaPct: number;
};

export async function getOverviewStats(): Promise<{
  kpi: KPI;
  charts: {
    revenueByMonth: { month: string; revenue: number }[];
    ordersByStatus: { status: string; count: number }[];
    topCategories: { category: string; total: number }[];
    revenueLast7: { day: string; revenue: number }[];
  };
}> {
  await connectDB();

  // --- KPIs (totals) ---
  const [usersCount, orders, productsCount] = await Promise.all([
    User.countDocuments(),
    Order.find({}, { total: 1, status: 1, createdAt: 1 }).lean(),
    Product.countDocuments(),
  ]);

  const totalOrders = orders.length;
  const totalRevenue = orders
    .filter((o) => o.status === "paid" || o.status === "completed")
    .reduce((sum, o) => sum + (Number(o.total) || 0), 0);

  // deltas (compare last 30d vs previous 30d)
  const now = new Date();
  const d30 = new Date(now);
  d30.setDate(now.getDate() - 30);
  const d60 = new Date(now);
  d60.setDate(now.getDate() - 60);

  const [usersLast30, usersPrev30, ordersLast30, ordersPrev30, revenueLast30, revenuePrev30] =
    await Promise.all([
      User.countDocuments({ createdAt: { $gte: d30 } }),
      User.countDocuments({ createdAt: { $gte: d60, $lt: d30 } }),
      Order.countDocuments({ createdAt: { $gte: d30 } }),
      Order.countDocuments({ createdAt: { $gte: d60, $lt: d30 } }),
      Order.aggregate([
        { $match: { createdAt: { $gte: d30 }, status: { $in: ["paid", "completed"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: d60, $lt: d30 }, status: { $in: ["paid", "completed"] } } },
        { $group: { _id: null, total: { $sum: "$total" } } },
      ]),
    ]);

  const prevRev = Number(revenuePrev30[0]?.total || 0);
  const lastRev = Number(revenueLast30[0]?.total || 0);

  const pct = (curr: number, prev: number) =>
    prev === 0 ? (curr > 0 ? 100 : 0) : Number((((curr - prev) / prev) * 100).toFixed(1));

  const kpi: KPI = {
    totalUsers: usersCount,
    totalOrders,
    totalProducts: productsCount,
    totalRevenue: Number(totalRevenue.toFixed(2)),
    usersDeltaPct: pct(usersLast30, usersPrev30),
    ordersDeltaPct: pct(ordersLast30, ordersPrev30),
    revenueDeltaPct: pct(lastRev, prevRev),
  };

  // --- Charts ---

  // Revenue by month (last 12 months)
  const since12 = new Date(now);
  since12.setMonth(now.getMonth() - 11);
  const revenueByMonthRaw = await Order.aggregate([
    { $match: { createdAt: { $gte: since12 }, status: { $in: ["paid", "completed"] } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" } },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1 } },
  ]);

  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const revenueByMonth = revenueByMonthRaw.map((r) => ({
    month: `${monthNames[r._id.m - 1]} ${r._id.y}`,
    revenue: Number(r.revenue || 0),
  }));

  // Orders by status (pie)
  const ordersByStatusAgg = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);
  const ordersByStatus = ordersByStatusAgg.map((s) => ({
    status: s._id || "unknown",
    count: s.count,
  }));

  // Top categories by sales (bar) — requires order items with product.category name or slug
  // Fallback: group by product.category field stored in order items.
  const topCategoriesAgg = await Order.aggregate([
    { $unwind: "$items" },
    // adjust field paths to your schema (e.g., items.categoryName or items.product.category)
    { $group: { _id: "$items.categoryName", total: { $sum: "$items.subtotal" } } },
    { $sort: { total: -1 } },
    { $limit: 6 },
  ]);
  const topCategories = topCategoriesAgg.map((c) => ({
    category: c._id || "Other",
    total: Number(c.total || 0),
  }));

  // Revenue last 7 days (area)
  const d7 = new Date(now);
  d7.setDate(now.getDate() - 6);
  const rev7Agg = await Order.aggregate([
    { $match: { createdAt: { $gte: d7 }, status: { $in: ["paid", "completed"] } } },
    {
      $group: {
        _id: { y: { $year: "$createdAt" }, m: { $month: "$createdAt" }, d: { $dayOfMonth: "$createdAt" } },
        revenue: { $sum: "$total" },
      },
    },
    { $sort: { "_id.y": 1, "_id.m": 1, "_id.d": 1 } },
  ]);

  const revByDayMap = new Map<string, number>();
  for (const r of rev7Agg) {
    const key = `${r._id.y}-${String(r._id.m).padStart(2,"0")}-${String(r._id.d).padStart(2,"0")}`;
    revByDayMap.set(key, Number(r.revenue || 0));
  }
  const days: { day: string; revenue: number }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(d7);
    d.setDate(d7.getDate() + i);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
    days.push({ day: key, revenue: revByDayMap.get(key) ?? 0 });
  }

  return {
    kpi,
    charts: {
      revenueByMonth,
      ordersByStatus,
      topCategories,
      revenueLast7: days,
    },
  };
}