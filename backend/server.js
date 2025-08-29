import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import couponRoutes from "./routes/couponRoutes.js";
import process from "process";

dotenv.config();
console.log("Loaded MONGO_URI:", process.env.MONGO_URI);


const app = express();


app.use(
  cors({
    origin: "*",
    credentials: true, 
  })
);

app.use(express.json());

mongoose
  .connect(process.env.MONGO_URI, {
    dbName: "testDB", 
  })
  .then(() => console.log(" MongoDB connected"))
  .catch((err) => console.error("MongoDB connection failed:", err));



app.use("/api/coupons", couponRoutes);


app.get("/", (req, res) => {
  res.send(" Backend is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
