import express from "express";
import { configDotenv } from "dotenv";
import { StartSendTopConsumer } from "./consumer.js";
configDotenv();
const app = express();
StartSendTopConsumer()
app.listen(process.env.PORT, () => {
  console.log("Mail is running ✅", process.env.PORT);
});
