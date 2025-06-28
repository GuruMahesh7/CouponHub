import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  redeemedCoupons: [
    {
      code: String,
      redeemedAt: Date
    }
  ]
});

const User = mongoose.model("User", userSchema);
export default User;
