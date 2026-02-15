import mongoose from "mongoose";

const mobileEmiSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: true,
      trim: true
    },

    mobileBrand: {
      type: String,
      required: true
    },

    mobileModel: {
      type: String,
      required: true
    },

    mobilePrice: {
      type: Number,
      required: true
    },

    downPayment: {
      type: Number,
      default: 0
    },

    emiMonths: {
      type: Number,
      required: true
    },

    interestRate: {
      type: Number,
      required: true // yearly %
    },

    monthlyEmi: {
      type: Number
    },

    totalAmount: {
      type: Number
    },

    startDate: {
      type: Date,
      default: Date.now
    },

    status: {
      type: String,
      enum: ["ACTIVE", "COMPLETED", "CANCELLED"],
      default: "ACTIVE"
    }
  },
  { timestamps: true }
);

export default mongoose.model("MobileEmi", mobileEmiSchema);
