import { configDotenv } from "dotenv";
import express from "express";
import { Chat } from "./src/model/chat.js";
import  router  from "./src/routes/chat.js";
const app = express();
configDotenv();
app.use(express.json());
Chat();
console.log("connected to database");

app.use("/v2", router);
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log("Connected to chat at:", PORT);
});
