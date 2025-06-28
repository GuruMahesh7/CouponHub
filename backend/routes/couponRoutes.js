import express from "express";
import Coupon from "../models/coupon.js";

const router = express.Router();

// Get all coupons
router.get("/coupons", async (req, res) => {
  const data = await Coupon.find();
  res.json(data);
});

// Create a coupon
router.post("/coupons", async (req, res) => {
  const newCoupon = new Coupon(req.body);
  await newCoupon.save();
  res.status(201).json(newCoupon);
});

// DELETE /api/coupons/:id
router.delete('/coupons/:id', async (req, res) => {
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
router.get('/coupons/:id', async (req, res) => {
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
router.put("/coupons/:id", async (req, res) => {
  try {
    const updated = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ message: "Coupon not found" });
    res.json({ message: "Coupon updated", coupon: updated });
  } catch (err) {
    res.status(500).json({ error: "Update failed" });
  }
});



export default router;
