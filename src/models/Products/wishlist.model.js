import mongoose from "mongoose";

const WishlistSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true,'User Id is Required / الرقم المميز للمستخدم مطلوب'],
      unique: [true,'User Id must be Unique / الرقم المميز للمستخد يجب ان يكون فريدا'] 
    },

    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product"
      }
    ],

    isDeleted: {
      type: Boolean,
      default: false
    },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Wishlist", WishlistSchema);
