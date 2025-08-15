import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Order from "@/models/order.model";
import { requireAdmin } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../auth/[...nextauth]/route";

export async function GET(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Not authenticated");

    requireAdmin(session.user);
    await connectDB();
    const order = await Order.findById(params.id)
      .populate("userId", "name email")
      .lean();

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}
