import mongoose from "mongoose";

const ReviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true,'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true,'Product Id is Required / الرقم المميز للمنتج مطلوب']
    },

    rating: {
      type: Number,
      required: [true,'Rating is Required / التقييم مطلوب'],
      min: 1,
      max: 5
    },

    comment: {
      type: String,
      default: ""
    },

    isVerifiedPurchase: {
      type: Boolean,
      default: false
    },

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

// Prevent multiple reviews per user per product
ReviewSchema.index({ user: 1, product: 1 }, { unique: true });

export default mongoose.model("Review", ReviewSchema);