import { configDotenv } from "dotenv";
configDotenv();
console.log("USER:", process.env.USER);
console.log("PASS:", process.env.PASS);
