import express from "express";
import Coupon from "../models/coupon.js";
import User from "../models/usermodel.js";
import Redemption from "../models/redeemptionmodel.js";

const router = express.Router();

// Get all coupons
router.get("/", async (req, res) => {
  const data = await Coupon.find();
  res.json(data);
});

// GET /api/analytics
router.get("/analytics", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    const redemptions = await Redemption.find()  //.populate("coupon user");

    // Build stats
    const couponStats = coupons.map((c) => {
      const couponRedemptions = redemptions.filter(r => r.coupon.equals(c._id));
      
      const usedCount = couponRedemptions.length;
      const totalDiscountGiven = couponRedemptions.reduce((sum, r) => sum + r.discountApplied, 0);
      const totalRevenueImpact = couponRedemptions.reduce((sum, r) => sum + r.finalBillAmount, 0);

      return {
        code: c.code,
        discountValue: c.discountValue,
        maxUsage: c.maxUsage,
        usedCount,
        totalDiscountGiven,
        totalRevenueImpact,
        status: (c.expiresAt < new Date() || usedCount >= c.maxUsage) ? "expired" : "active"
      };
    });

    res.json({
      coupons: couponStats,
      summary: {
        totalCoupons: coupons.length,
        totalRedemptions: redemptions.length,
        totalDiscounts: couponStats.reduce((s, c) => s + c.totalDiscountGiven, 0),
        totalRevenue: couponStats.reduce((s, c) => s + c.totalRevenueImpact, 0),
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users who have redeemed coupons
router.get("/users/:id", async (req, res) => {
  const {id}= req.params
  const redeemptions = await Redemption.find({coupon: id});
  const userIds = redeemptions.map((r) => r.user);
  const users = await User.find({ _id: { $in: userIds } });
  const userData = users.map((user) => ({
    _id: user._id,
    name: user.name,
    email: user.email,
    redeemedAt: user.createdAt,
  }));
  res.json(userData);
});

// Create a coupon
router.post("/createcoupon", async (req, res) => {
  const newCoupon = new Coupon(req.body);
  await newCoupon.save();
  res.status(201).json(newCoupon);
});

// User Redeemption
router.post("/redeemption", async (req, res) => {
  try {
    const { name, email, billAmount, couponCode } = req.body;

    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, billAmount });
    }
    // const user = await User.create({ name, email, billAmount, couponCode });

    const coupon = await Coupon.findOne({ code: couponCode });
    if (!coupon) return res.status(404).json({ message: "Coupon not found" });

    if (coupon.expiryDate < new Date()) {
      return res.status(400).json({ message: "Coupon expired" });
    }

    // Check if this user already redeemed this coupon ❌
    const alreadyRedeemed = await Redemption.findOne({
      user: user._id,
      coupon: coupon._id,
    });
    if (alreadyRedeemed) {
      return res.status(400).json({
        message: "You have already used this coupon!",
        success: false,
      });
    }

    const discountApplied =
      coupon.discountType === "percentage"
        ? (user.billAmount * coupon.discountValue) / 100
        : coupon.discountValue;

    const finalBill = Math.max(user.billAmount - discountApplied, 0);
    const newRedemption = new Redemption({
      user: user._id,
      coupon: coupon._id,
      originalBillAmount: billAmount,
      discountApplied,
      finalBillAmount: finalBill,
    });
    await newRedemption.save();

    coupon.usedCount = (coupon.usedCount || 0) + 1;
    if (coupon.usedCount >= coupon.maxUsage) {
      coupon.status = "expired";
    }
    await coupon.save();

    res
      .status(201)
      .json({
        message: "Coupon redeemed successfully",
        success: true,
        finalAmount: finalBill,
      });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a single coupon by ID
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete coupon" });
    console.log(err)
  }
});

// GET a single coupon by ID
router.get('/:id', async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found' });
    }
    res.status(200).json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Invalid coupon ID or server error' });
  }
});

// Update coupon
router.put("/:id", async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon updated", coupon: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed", message:err.message });
  }
});







export default router;
