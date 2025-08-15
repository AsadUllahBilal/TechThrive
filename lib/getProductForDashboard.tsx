import { connectDB } from "@/lib/mongo";
import Product from "@/models/product.model";

export async function getProductsWithDetails(limit = 10) {
  await connectDB();
  return Product.find()
    .populate("category", "name slug") // category name + slug only
    .populate({
      path: "reviews",
      populate: { path: "user", select: "name" },
    })
    .limit(limit)
    .lean();
}
