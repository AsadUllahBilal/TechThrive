import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Product from "@/models/product.model";
import slugify from "slugify";
import { getSessionUser, requireAdmin } from "@/lib/auth";
import mongoose from "mongoose";
import { getProductById } from "@/lib/getDBProducts";

export async function PUT(
  req: Request,
  context: {params: Promise<{id: string}>}
) {
  try {
    const { id } = await context.params;
    const user = await getSessionUser();
    requireAdmin(user);

    await connectDB();

    const body = await req.json();

    // Validate product id
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { error: "Invalid product ID" },
        { status: 400 }
      );
    }

    // Get existing product first
    const existingProduct = await Product.findById(id);
    if (!existingProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Prepare update data
    const updatedData: any = { ...body };

    // If name updated, regenerate slug
    if (body.name && body.name !== existingProduct.name) {
      updatedData.slug = slugify(body.name, { lower: true, strict: true });
    }

    // Perform update with only updated fields
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      updatedData,
      { new: true, runValidators: true }
    );

    return NextResponse.json(updatedProduct, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getSessionUser();
    requireAdmin(user);

    await connectDB();
    const product = await Product.findByIdAndDelete(params.id);
    if (!product)
      return NextResponse.json({ error: "Product not found" }, { status: 404 });

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}