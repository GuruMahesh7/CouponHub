import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import couponRoutes from "./routes/couponRoutes.js";
import userRoutes from "./routes/userRoutes.js";


dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  dbName: "testDB",
})
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err.message));


app.use("/api", couponRoutes);
app.use("/api", userRoutes);  

console.log("Connecting to:", process.env.MONGO_URI);

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
