import { connectDB } from "@/lib/mongo";
import orderModel from "@/models/order.model";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";
import { requireAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Not authenticated");

    requireAdmin(session.user);

    await connectDB();
    const orders = await orderModel
      .find({})
      .sort({ createdAt: -1 })
      .populate("userId", "name email");
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
