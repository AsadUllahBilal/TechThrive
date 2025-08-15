import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Order from "@/models/order.model";
import { requireAdmin } from "@/lib/auth";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

interface Params {
  id: string;
}

export async function GET(req: Request, context: { params: Params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Not authenticated");
    const {id} = context.params

    requireAdmin(session.user);
    await connectDB();
    const order = await Order.findById(id)
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
