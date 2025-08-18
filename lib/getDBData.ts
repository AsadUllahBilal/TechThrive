import Product from "@/models/product.model";
import Category from "@/models/category.model";
import { connectDB } from "@/lib/mongo";

export async function getAllProducts() {
  await connectDB();
  return await Product.find({}).populate("category").lean();
}

export async function getAllCategories() {
  await connectDB();
  return await Category.find({}).lean();
}
