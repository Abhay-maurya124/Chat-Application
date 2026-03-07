import express from "express";
import {
  createNewChat,
  getAllChats,
  getAllMessagesByChats,
  sendMessage,
} from "../controller/chat.js";
import { isAuth } from "../middleware/isAuthenticated.js";
import { upload } from "../middleware/multer.js";

const router = express.Router();

router.post("/newChat", isAuth, createNewChat);
router.get("/chat/all", isAuth, getAllChats);
router.get("/message/:chatId", isAuth, getAllMessagesByChats);
router.post("/message", isAuth, upload.single("image"), sendMessage);
export default router;
