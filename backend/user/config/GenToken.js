import { configDotenv } from "dotenv";
import jwt from "jsonwebtoken";

configDotenv();
const SECRET_KEY = process.env.SECRET_KEY;
export const GenToken = (user) => {
  return jwt.sign({ user }, SECRET_KEY, { expiresIn: "24h" });
};
