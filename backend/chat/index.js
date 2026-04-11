import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose";
import router from "./src/routes/chat.js";
import cors from "cors";
import { app, server } from "./src/config/Socket.js";

configDotenv();
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173" || "https://chat-application-dusky-theta.vercel.app/",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Chat Connected to Database");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1);
  }
};

connectDB();

app.use("/v2", router);

const PORT = process.env.PORT || 5002;
server.listen(PORT, () => {
  console.log("🚀 Chat service running at:", PORT);
});