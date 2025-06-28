import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: String,
  discountType: String,
  discountValue: Number,
  maxUsage: Number,
  usedCount: Number,
  expiresAt: Date,
  status: String
});

export default mongoose.model("Coupon", couponSchema);
