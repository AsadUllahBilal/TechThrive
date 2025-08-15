import { CategoryType, Product } from "@/types/product";
import { connectDB } from "@/lib/mongo";
import ProductModel from "@/models/product.model";
import Category from "@/models/category.model"; // <-- add this line
import mongoose from "mongoose";

export const delay = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

export async function getAllProducts({
  page = 1,
  limit = 10,
  search = "",
  categories = "",
}: {
  page?: number;
  limit?: number;
  search?: string;
  categories?: string;
}) {
  await connectDB();

  const query: any = {};

  if (search) {
    query.name = { $regex: search, $options: "i" };
  }

  if (categories) {
    // Split category slugs and find matching category IDs
    const categorySlugs = categories.split(".");
    const matchedCategories = await Category.find({
      slug: { $in: categorySlugs },
    })
      .select("_id")
      .lean();
    const categoryIds = matchedCategories.map((cat) => cat._id);
    query.category = { $in: categoryIds };
  }

  const skip = (page - 1) * limit;

  const productsFromDb = await ProductModel.find(query)
    .populate("category")
    .skip(skip)
    .limit(limit)
    .lean();

  const totalProducts = await ProductModel.countDocuments(query);

  const products: Product[] = productsFromDb.map((p) => ({
    _id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    images: p.images ?? [],
    category: p.category
      ? {
          _id: p.category._id.toString(),
          name: p.category.name,
          slug: p.category.slug,
        }
      : undefined,
    brand: p.brand ?? "",
    stock: p.stock ?? 0,
    averageRating: p.averageRating ?? 0,
    totalReviews: p.totalReviews ?? 0,
    reviews: p.reviews ?? [],
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  }));

  return { products, total_products: totalProducts };
}

export async function getProductById(id: string): Promise<Product | null> {
  await connectDB();

  const p = await ProductModel.findById(id).populate("category").lean();

  if (!p) return null;

  return {
    _id: p._id.toString(),
    name: p.name,
    slug: p.slug,
    description: p.description,
    price: p.price,
    images: p.images ?? [],
    category: p.category
      ? {
          _id: p.category._id.toString(),
          name: p.category.name,
          slug: p.category.slug,
        }
      : undefined,
    brand: p.brand ?? "",
    stock: p.stock ?? 0,
    averageRating: p.averageRating ?? 0,
    totalReviews: p.totalReviews ?? 0,
    reviews: p.reviews ?? [],
    createdAt: p.createdAt?.toISOString(),
    updatedAt: p.updatedAt?.toISOString(),
  };
}