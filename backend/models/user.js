
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // hashed password
  usedCoupons: [
    {
      code: { type: String, required: true },
      redeemedAt: { type: Date, default: Date.now }, // optional: track usage time
    },
  ],
});

const UserModel = mongoose.model("userRegister", userSchema);
export default UserModel;
