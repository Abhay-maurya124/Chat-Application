import { Server } from "socket.io";
import http from "http";
import express from "express";
import { Messages } from "../model/messages.js";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; 

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  if (userId && userId !== "undefined") userSocketMap[userId] = socket.id;

  io.emit("getOnlineUser", Object.keys(userSocketMap));

  socket.on("markAsSeen", async (data) => {
    const { chatId, userId } = data;
    
    try {
      const unseenMessages = await Messages.find({
        chatId,
        senderId: { $ne: userId },
        seen: false
      }, { _id: 1 });

      const unseenMessageIds = unseenMessages.map(msg => msg._id);

      await Messages.updateMany(
        { chatId, senderId: { $ne: userId }, seen: false },
        { seen: true, seenAt: new Date() }
      );

      socket.broadcast.emit("messagesSeen", {
        chatId,
        messageIds: unseenMessageIds
      });
    } catch (error) {
      console.error("Error in markAsSeen:", error);
    }
  });

  socket.on("disconnect", () => {
    if (userId) {
      delete userSocketMap[userId];
      io.emit("getOnlineUser", Object.keys(userSocketMap));
    }
  });
});

export { app, server, io };