import mongoose from "mongoose";

const PaymentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, 'User Id is Required / الرقم المميز للمستخدم مطلوب']
    },

    order: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Order",
      required: [true, 'Order Id is Required / الرقم المميز للطلب مطلوب']
    },

    paymentMethod: {
      type: String,
      enum: {
        values: ['COD', 'online', 'paypal', 'stripe'],
        message: 'Invalid Payment Method / طريقة الدفع غير صالحة'
      },
      required: [true, 'Payment method is Required / طريقة الدفع مطلوبة']
    },

    transactionId: {
      type: String,
      required: [true, 'Transaction ID is Required / رقم المعاملة مطلوب']
    },

    amount: {
      type: Number,
      required: [true, 'Payment amount is Required / مبلغ الدفع مطلوب'],
      min: [0, 'Amount must be greater than 0 / يجب أن يكون المبلغ أكبر من صفر']
    },

    status: {
      type: String,
      enum: ['pending', 'completed', 'failed', 'refunded'],
      default: 'pending'
    },

    currency: {
      type: String,
      default: 'EGP'
    },

    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date }
  },
  { timestamps: true }
);

export default mongoose.model("Payment", PaymentSchema);
