import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import couponRoutes from "./routes/couponRoutes.js";
import process from "process";
import { ALLOWED_ORIGINS } from "./config.js";

dotenv.config();

console.log("Loaded MONGO_URI:", process.env.MONGO_URI);

const app = express();

app.use(
    cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
    })
);

app.use(express.json());

mongoose
    .connect(process.env.MONGO_URI || "mongodb+srv://mongoguru:guru@77cluster0.xh9qpgp.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
        dbName: "testDB",
    })
    .then(() => console.log(" MongoDB connected"))
    .catch((err) => console.error("MongoDB connection failed:", err));

app.use("/api/coupons", couponRoutes);
app.use("/user", couponRoutes);

app.get("/", (req, res) => {
    res.send(" Backend is running");
});

export default app;
