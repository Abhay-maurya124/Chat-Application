import express from "express";
import { createNewChat, getAllChats } from "../controller/chat.js";
import { isAuth } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post("/newChat",isAuth, createNewChat);
router.get("/chat/all",isAuth,getAllChats)
export default router