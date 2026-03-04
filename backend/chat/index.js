import { configDotenv } from "dotenv";
import express from "express";

const app = express();
configDotenv();
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Connected to chat at:", PORT);
});
