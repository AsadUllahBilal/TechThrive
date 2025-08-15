import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongo";
import Product from "@/models/product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/(root)/api/auth/[...nextauth]/route";
import { requireAdmin } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) throw new Error("Not authenticated");

    requireAdmin(session.user);

    await connectDB();

    const body = await req.json();

    // Validate or sanitize body.images if needed here

    const product = await Product.create(body); // body must have images array here

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
}

export async function GET() {
  await connectDB();
  try {
    const products = await Product.find({}).populate("category");
    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "Error fetching Products", details: (error as Error).message },
      { status: 500 }
    );
  }
}