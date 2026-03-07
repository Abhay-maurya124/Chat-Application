import { configDotenv } from "dotenv";
import express from "express";
import mongoose from "mongoose"; 
import router from "./src/routes/chat.js";

configDotenv();
const app = express();
app.use(express.json());

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("✅ Real connection to MongoDB established");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err);
    process.exit(1); 
  }
};

connectDB(); 

app.use("/v2", router);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => {
  console.log("🚀 Chat service running at:", PORT);
});