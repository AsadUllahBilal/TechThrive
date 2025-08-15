import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import slugify from "slugify";
import Category from "@/models/category.model";

// CREATE CATEGORY
export async function POST(req: Request) {
  await connectDB();
  try {
    const { name, description, image } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const slug = slugify(name, { lower: true, strict: true });

    const category = await Category.create({
      name,
      slug,
      description,
      image,
    });

    return NextResponse.json(category, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error creating category", details: (error as Error).message },
      { status: 500 }
    );
  }
}

// GET ALL CATEGORIES
export async function GET() {
  await connectDB();
  try {
    const categories = await Category.find();
    return NextResponse.json(categories, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching categories", details: (error as Error).message },
      { status: 500 }
    );
  }
}
