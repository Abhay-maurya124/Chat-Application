import tryCatch from "../config/tryCatch.js";
import { Chat } from "../model/chat.js";
import { Messages } from "../model/messages.js";
import axios from "axios";
import { io, getReceiverSocketId } from "../config/Socket.js";

export const createNewChat = tryCatch(async (req, res) => {
    const userId = req.user?._id;
    const { otherUserId } = req.body;

    if (!otherUserId) {
        return res.status(400).json({ message: "other User id is needed", success: false });
    }

    const existingChat = await Chat.findOne({
        users: { $all: [userId, otherUserId], $size: 2 },
    });

    if (existingChat) {
        return res.status(200).json({ message: "Chat already exists", chatId: existingChat._id });
    }

    const newChat = await Chat.create({ users: [userId, otherUserId] });

    const receiverSocketId = getReceiverSocketId(otherUserId);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newChatCreated", newChat);
    }

    res.status(201).json({ message: "Chat created successfully", success: true, chatId: newChat._id });
});

export const getAllChats = tryCatch(async (req, res) => {
    const userId = req.user?._id;
    if (!userId) return res.status(400).json({ message: "User not found" });

    const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });

    const chatWithUserData = await Promise.all(
        chats.map(async (chat) => {
            const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
            const unSeencount = await Messages.countDocuments({
                chatId: chat._id,
                senderId: { $ne: userId },
                seen: false,
            });

            try {
                const response = await axios.get(`${process.env.USER_SERVICE}/v1/user/alluser/${otherUserId}`, { timeout: 5000 });
                const userData = response.data.user || response.data;
                return {
                    user: userData,
                    chat: { ...chat.toObject(), unSeencount },
                };
            } catch (error) {
                return {
                    user: { _id: otherUserId, name: "Unknown user" },
                    chat: { ...chat.toObject(), unSeencount },
                };
            }
        })
    );

    res.json({ chats: chatWithUserData });
});

export const sendMessage = tryCatch(async (req, res) => {
    const senderId = req.user?._id;
    const { chatId, text } = req.body;
    const imageFile = req.file;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(400).json({ message: "Chat not found" });

    const otherUserID = chat.users.find((id) => id.toString() !== senderId.toString());

    let messageData = {
        chatId,
        senderId,
        text: text || "",
        messageType: imageFile ? "image" : "text",
        image: imageFile ? { url: imageFile.path, publicId: imageFile.filename } : undefined,
        seen: false,
    };

    const message = new Messages(messageData);
    const savedMessage = await message.save();

    await Chat.findByIdAndUpdate(chatId, {
        latestMessage: { text: imageFile ? "image" : text, sender: senderId },
        updatedAt: new Date(),
    });

    const receiverSocketId = getReceiverSocketId(otherUserID);
    if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", savedMessage);
    }

    return res.status(201).json({ message: savedMessage, sender: senderId });
});

export const getAllMessagesByChats = tryCatch(async (req, res) => {
    const { chatId } = req.params;
    const userId = req.user?._id;

    const chat = await Chat.findById(chatId);
    if (!chat) return res.status(400).json({ message: "Chat not found" });

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

    const otherUserId = chat.users.find((id) => id.toString() !== userId.toString());
    const senderSocketId = getReceiverSocketId(otherUserId);
    if (senderSocketId) {
        io.to(senderSocketId).emit("messagesSeen", { chatId, messageIds: unseenMessageIds });
    }

    const actualMessagesArray = await Messages.find({ chatId }).sort({ createdAt: 1 });

    try {
        const response = await axios.get(`${process.env.USER_SERVICE}/v1/user/alluser/${otherUserId}`, { timeout: 5000 });
        const userData = response.data.user || response.data;
        res.json({ messages: actualMessagesArray, user: userData });
    } catch (error) {
        res.json({ messages: actualMessagesArray, user: { _id: otherUserId, name: "Unknown" } });
    }
});