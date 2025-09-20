import mongoose from "mongoose";

const redemptionSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "userRegister",
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
  },
  { timestamps: true }
);

const Redemption = mongoose.model("Redemption", redemptionSchema);
export default Redemption;
