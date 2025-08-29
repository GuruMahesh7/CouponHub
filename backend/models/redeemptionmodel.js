import mongoose from "mongoose";

const redemptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    coupon: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Coupon",
      required: true,
    },
    redeemedAt: {
      type: Date,
      default: Date.now,
    },
    discountApplied: {
      type: Number, 
      required: true,
    },
    finalBillAmount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Redemption = mongoose.model("Redemption", redemptionSchema);
export default Redemption;
