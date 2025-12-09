/* --------------------------------------------------------------------------
 * 🛳 Shipping Model
 * - Stores shipping information for orders
 * - Tracks carrier, tracking number, status, and estimated delivery
 * - Supports soft delete
 * -------------------------------------------------------------------------- */
import mongoose from "mongoose";

const ShippingSchema = new mongoose.Schema(
  {
    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, 'Order Id is required / الرقم المميز للطلب مطلوب']
    },

    carrier: {
      type: String,
      required: [true, 'Carrier is required / شركة الشحن مطلوبة']
    },

    trackingNumber: {
      type: String,
      required: [true, 'Tracking number is required / رقم التتبع مطلوب']
    },

    status: {
      type: String,
      enum: ["pending", "shipped", "in_transit", "delivered", "cancelled"],
      default: "pending"
    },

    estimatedDelivery: {
      type: Date
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

const Shipping =  mongoose.model("Shipping", ShippingSchema);
export default Shipping;
