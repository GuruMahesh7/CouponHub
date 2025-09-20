import express from "express";
import Coupon from "../models/coupon.js";
import User from "../models/usermodel.js";
import Redemption from "../models/redeemptionmodel.js";
import Razorpay from "razorpay";
import crypto from "crypto";
import process from "process";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import UserModel from "../models/user.js";

const router = express.Router();
dotenv.config();

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

// REGISTER
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const existingUser = await UserModel.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Save new user
    const user = new UserModel({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully ✅" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email });
    if (!user) return res.status(400).json({ errMessage: "User not found" });

    const correctPass = await bcrypt.compare(password, user.password);
    if (!correctPass)
      return res.status(401).json({ errMessage: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "Login successful!",
      token,
      user: {
        id: user._id,
        email: user.email,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// LOGOUT
router.post("/logout", (req, res) => {
  res.clearCookie("jwt-token");
  res.json({ message: "Logged out successfully ✅" });
});

// Get all coupons
router.get("/", async (req, res) => {
  const data = await Coupon.find();
  res.json(data);
});

// GET /api/analytics
router.get("/analytics", async (req, res) => {
  try {
    const coupons = await Coupon.find();
    const redemptions = await Redemption.find(); //.populate("coupon user");

    // Build stats
    const couponStats = coupons.map((c) => {
      const couponRedemptions = redemptions.filter((r) =>
        r.coupon.equals(c._id)
      );

      const usedCount = couponRedemptions.length;
      const totalDiscountGiven = couponRedemptions.reduce(
        (sum, r) => sum + r.discountApplied,
        0
      );
      const totalRevenueImpact = couponRedemptions.reduce(
        (sum, r) => sum + r.finalBillAmount,
        0
      );

      return {
        code: c.code,
        discountValue: c.discountValue,
        maxUsage: c.maxUsage,
        usedCount,
        totalDiscountGiven,
        totalRevenueImpact,
        status:
          c.expiresAt < new Date() || usedCount >= c.maxUsage
            ? "expired"
            : "active",
      };
    });

    res.json({
      coupons: couponStats,
      summary: {
        totalCoupons: coupons.length,
        totalRedemptions: redemptions.length,
        totalDiscounts: couponStats.reduce(
          (s, c) => s + c.totalDiscountGiven,
          0
        ),
        totalRevenue: couponStats.reduce((s, c) => s + c.totalRevenueImpact, 0),
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all users who have redeemed coupons
router.get("/users/:id", async (req, res) => {
  const { id } = req.params;
  const redeemptions = await Redemption.find({ coupon: id });
  const userIds = redeemptions.map((r) => r.user);
  const users = await UserModel.find({ _id: { $in: userIds } });
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
// router.post("/redeemption", async (req, res) => {
//   try {
//     const { name, email, billAmount, couponCode } = req.body;

//     let user = await User.findOne({ email });
//     if (!user) {
//       user = await User.create({ name, email, billAmount });
//     }
//     // const user = await User.create({ name, email, billAmount, couponCode });

//     const coupon = await Coupon.findOne({ code: couponCode });
//     if (!coupon) return res.status(404).json({ message: "Coupon not found" });

//     if (coupon.expiresAt < new Date()) {
//       return res.status(400).json({ message: "Coupon expired" });
//     }

//     // Check if this user already redeemed this coupon ❌
//     const alreadyRedeemed = await Redemption.findOne({
//       user: user._id,
//       coupon: coupon._id,
//     });
//     if (alreadyRedeemed) {
//       return res.status(400).json({
//         message: "You have already used this coupon!",
//         success: false,
//       });
//     }

//     const discountApplied =
//       coupon.discountType === "percentage"
//         ? (billAmount * coupon.discountValue) / 100
//         : coupon.discountValue;

//     const finalBill = Math.max(billAmount - discountApplied, 0);
//     const options = {
//       amount: finalBill * 100, // in paise
//       currency: "INR",
//       receipt: "redeem_" + Date.now(),
//     };
//     const order = await razorpay.orders.create(options);

//     res.status(200).json({
//       success: true,
//       message: "Coupon applied successfully. Proceed to payment.",
//       finalAmount: finalBill,
//       orderId: order.id,
//       key: process.env.RAZORPAY_KEY_ID,
//       userId: user._id,
//       couponId: coupon._id,
//       discountApplied,
//     });
//   } catch (error) {
//     res.status(400).json({ success: false, message: error.message });
//   }
// });

router.post("/validate-coupon", async (req, res) => {
  try {
    const { userId, code } = req.body;

    // 1️⃣ Find coupon
    const coupon = await Coupon.findOne({ code });
    if (!coupon)
      return res
        .status(404)
        .json({ valid: false, message: "Coupon not found" });

    // 2️⃣ Check expiry
    if (coupon.expiresAt < new Date()) {
      return res.status(400).json({ valid: false, message: "Coupon expired" });
    }

    // 3️⃣ Check if usage limit reached
    if ((coupon.usedCount || 0) >= coupon.maxUsage) {
      return res
        .status(400)
        .json({ valid: false, message: "Coupon usage limit reached" });
    }

    // 4️⃣ Find user
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ valid: false, message: "User not found" });
    }

    // 5️⃣ Check if user already redeemed this coupon
    const alreadyRedeemed = await Redemption.findOne({
      user: user._id,
      coupon: coupon._id,
    });

    if (alreadyRedeemed) {
      return res.json({
        valid: true,
        message: "You have already redeemed this coupon before. ✅",
      });
    }

    // 6️⃣ Create redemption
    const redemption = await Redemption.create({
      user: user._id,
      coupon: coupon._id,
    });

    // 7️⃣ Increment coupon usage
    coupon.usedCount = (coupon.usedCount || 0) + 1;
    if (coupon.usedCount >= coupon.maxUsage) coupon.status = "expired";
    await coupon.save();

    res.status(200).json({
      valid: true,
      message: "Coupon applied successfully! ✅",
      redemption,
      coupon,
    });
  } catch (error) {
    res.status(500).json({ valid: false, message: error.message });
  }
});


router.get("/view-users/:id", async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ Fetch all redemptions for this coupon
    const redemptions = await Redemption.find({ coupon: id });
    // console.log("Redemptions:", redemptions);
    // 2️⃣ Get all user IDs
    const userIds = redemptions.map((r) => r.user);
    // console.log("User IDs:", userIds);
    // 3️⃣ Fetch user details from userRegister model
    const users = await UserModel.find({ _id: { $in: userIds } });
    // console.log("Users:", users);
    // 4️⃣ Combine with redeemedAt
    const userData = users.map((user) => {
      const redemption = redemptions.find(
        (r) => r.user.toString() === user._id.toString()
      );
      return {
        id: user._id,
        name: user.name,
        email: user.email,
        redeemedAt: redemption ? redemption.redeemedAt : null,
      };
    });
    console.log("User Data:", userData);
    res.json(userData);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});





//payment cerfication
router.post("/verify-payment", async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      userId,
      couponId,
      originalBillAmount,
      discountApplied,
      finalBillAmount,
    } = req.body;

    // Verify signature
    const body = razorpay_order_id + "|" + razorpay_payment_id;
    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res
        .status(400)
        .json({ success: false, message: "Payment verification failed" });
    }

    // ✅ Save redemption only after verified payment
    const newRedemption = new Redemption({
      user: userId,
      coupon: couponId,
      orderId: req.body.razorpay_order_id,
      originalBillAmount,
      discountApplied,
      finalBillAmount,
    });
    await newRedemption.save();

    // Update coupon usage
    const coupon = await Coupon.findById(couponId);
    coupon.usedCount = (coupon.usedCount || 0) + 1;
    if (coupon.usedCount >= coupon.maxUsage) coupon.status = "expired";
    await coupon.save();

    res.json({ success: true, message: "Payment verified & coupon redeemed!" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE a single coupon by ID
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    await Coupon.findByIdAndDelete(id);
    res.status(200).json({ message: "Coupon deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete coupon" });
    console.log(err);
  }
});

// GET a single coupon by ID
router.get("/:id", async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: "Coupon not found" });
    }
    res.status(200).json(coupon);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Invalid coupon ID or server error" });
  }
});

// Update coupon
router.put("/:id", async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon updated", coupon: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed", message: err.message });
  }
});




export default router;
