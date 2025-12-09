import mongoose from "mongoose";

const AuditLogSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    action: {
      type: String,
      required: [true, 'Action is Required / الإجراء مطلوب'],
      enum: [
        'CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 
        'PAYMENT', 'ORDER', 'REFUND', 'COUPON', 'CART', 'WISHLIST'
      ],
      message: 'Invalid action type / نوع الإجراء غير صالح'
    },

    targetModel: {
      type: String,
      required: [true, 'Target Model is Required / النموذج المستهدف مطلوب']
    },

    targetId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    },

    description: {
      type: String,
      required: [true, 'Description is Required / الوصف مطلوب']
    },

    ipAddress: { type: String, default: null },

    userAgent: { type: String, default: null },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

const AuditLog =  mongoose.model("AuditLog", AuditLogSchema);
export default AuditLog;
