import { connectDB } from "@/lib/mongo";
import Review from "@/models/reviews.model";

export async function getReviewsByProductId(productId: string) {
  try {
    await connectDB();

    const reviews = await Review.find({ product: productId })
      .populate("user", "name email")
      .sort({ createdAt: -1 })
      .lean();

    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return [];
  }
}
