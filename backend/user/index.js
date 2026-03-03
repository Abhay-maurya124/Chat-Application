import { configDotenv } from "dotenv";
import express from "express";
import connectDB from "./config/db.js";
import { createClient } from "redis";
import router from "./routes/user.js";
configDotenv();
connectDB();
const app = express();
const PORT = process.env.PORT;

export const redisClient = createClient({
  url: process.env.REDIS_URL,
});
redisClient
  .connect()
  .then(() => console.log("Redis is connected"))
  .catch((error) => console.log(error));
app.use(express.json());
app.use("/v1/user", router);
app.listen(PORT, () => {
  console.log("Server is running at port: ", PORT);
});
