import mongoose, { Schema, Document, Model } from "mongoose";
import slugify from "slugify";

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  category: mongoose.Types.ObjectId;
  brand?: string;
  images: string[];
  specifications?: Record<string, any>;
  averageRating: number;
  totalReviews: number;
  createdAt: Date;
}

export interface ProductModel extends Model<IProduct> {
  updateReviewStats(productId: string): Promise<void>;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, unique: true },
    description: { type: String },
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    brand: { type: String },
    images: [{ type: String }],
    specifications: { type: Schema.Types.Mixed },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  if (this.isModified("name")) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

ProductSchema.statics.updateReviewStats = async function (productId: string) {
  const Review = mongoose.model("Review");
  const stats = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: "$product",
        avgRating: { $avg: "$rating" },
        totalReviews: { $sum: 1 },
      },
    },
  ]);

  if (stats.length > 0) {
    await this.findByIdAndUpdate(productId, {
      averageRating: stats[0].avgRating,
      totalReviews: stats[0].totalReviews,
    });
  } else {
    await this.findByIdAndUpdate(productId, {
      averageRating: 0,
      totalReviews: 0,
    });
  }
};

const Product: ProductModel =
  (mongoose.models.Product as ProductModel) ||
  mongoose.model<IProduct, ProductModel>("Product", ProductSchema);

export default Product;
