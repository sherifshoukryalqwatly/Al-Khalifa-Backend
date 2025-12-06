import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: [true, 'Product Id is Required / الرقم المميز للمنتج مطلوب']
    },

    variant: {
      size: { 
        type: String, 
        required: [true, 'Size is Required / المقاس مطلوب'] 
      },
      color: { 
        type: String, 
        required: [true, 'Color is Required / اللون مطلوب'] 
      }
    },

    quantity: {
      type: Number,
      required: [true, 'Quantity is Required / الكمية مطلوبة'],
      min: [1, 'Quantity must be at least 1 / يجب أن تكون الكمية 1 على الأقل']
    },

    priceAtAddition: {
      type: Number,
      required: [true, 'Price at addition is Required / سعر الإضافة مطلوب']
    },

    totalItemPrice: {
      type: Number,
      required: [true, 'Total item price is Required / السعر الإجمالي مطلوب']
    }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      unique: true,
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    items: {
      type: [CartItemSchema],
      default: []
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// ⭐ Virtual total price
CartSchema.virtual('totalPrice').get(function () {
  return this.items.reduce((sum, item) => sum + item.totalItemPrice, 0);
});

export default mongoose.model("Cart", CartSchema);
