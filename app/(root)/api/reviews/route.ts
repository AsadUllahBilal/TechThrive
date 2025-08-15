import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Review from "@/models/reviews.model";
import mongoose from "mongoose";

import { getSessionUser } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    await connectDB();

    const body = await req.json();
    const { productId, rating, comment } = body;

    const review = await Review.create({
      product: productId,
      rating,
      comment,
      user: user.id
    });

    return NextResponse.json(review, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function GET(req: Request) {
  await connectDB();
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("productId");

  try {
    const reviews = await Review.find({ product: productId })
      .populate("user", "name profilePicture")
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching Review", details: (error as Error).message },
      { status: 500 }
    );
  }
}
