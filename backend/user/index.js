import { configDotenv } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import router from "./routes/user.js";
import cors from "cors";
import { connectRabbitmq } from "./config/rabbitmq.js";
configDotenv();
const app = express();
const PORT = process.env.PORT;
app.use(
  cors({
    origin: ["http://localhost:5173", "https://chat-application-dusky-theta.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  }),
);
export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
const startServer = async () => {
  try {
    await connectDB();
    console.log("Connected to database");

    await redisClient.connect();
    console.log("Redis is connected");

    await connectRabbitmq();

    app.use(express.json());
    app.use("/v1/user", router);

    app.listen(PORT, () => {
      console.log(`Server is running at port: ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
};

startServer();
