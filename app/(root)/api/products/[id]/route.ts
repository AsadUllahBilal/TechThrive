import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Product from "@/models/product.model";

// GET single product
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const product = await Product.findById(params.id);
  if (!product) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }
  return NextResponse.json(product);
}

// UPDATE product
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const body = await req.json();

  const updated = await Product.findByIdAndUpdate(params.id, body, {
    new: true,
  });

  if (!updated) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

// DELETE product
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  await connectDB();
  const deleted = await Product.findByIdAndDelete(params.id);

  if (!deleted) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ message: "Product deleted successfully" });
}
