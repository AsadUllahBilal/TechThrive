import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: { type: String, required: true }, // snapshot name
    image: { type: String, required: true }, // snapshot image
    price: { type: Number, required: true }, // snapshot price
    quantity: { type: Number, required: true },
  },
  { _id: false } // don't create _id for each subdocument
);

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    orderItems: [orderItemSchema],

    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      phoneNumber: {type: String, required: true}
    },

    paymentMethod: { type: String, }, // e.g. 'PayPal', 'Credit Card'
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "pending",
    },

    shippingStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled"],
      default: "pending",
    },

    totalPrice: { type: Number, required: true },
  },
  { timestamps: true } // createdAt and updatedAt automatically
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);