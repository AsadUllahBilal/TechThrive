import mongoose, { Schema, Document, Model } from "mongoose";
import Product from "./product.model";

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, trim: true },
  },
  { timestamps: true }
);

// ReviewSchema.index({ product: 1, user: 1 }, { unique: true });

ReviewSchema.post("save", function () {
  Product.updateReviewStats(this.product.toString());
});

ReviewSchema.post("findOneAndDelete", function (doc) {
  if (doc) {
    Product.updateReviewStats(doc.product.toString());
  }
});

const Review: Model<IReview> =
  (mongoose.models.Review as Model<IReview>) ||
  mongoose.model<IReview>("Review", ReviewSchema);

export default Review;
