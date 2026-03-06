import tryCatch from "../config/tryCatch.js";
import { Chat } from "../model/chat.js";
import { messages } from "../model/messages.js";

export const createNewChat = tryCatch(async (req, res) => {
  const userId = req.user?._id;
  const { otherUserId } = req.body;

  if (!otherUserId) {
    return res.status(400).json({
      message: "other User id is needed",
      success: false,
    });
  }
  const existingChat = await Chat.findOne({
    users: { $all: [userId, otherUserId], $size: 2 },
  });

  if (existingChat) {
    return res.status(200).json({
      message: "Chat already exist ",
      chatId: existingChat._id,
    });
  }

  const newChat = await Chat.create({
    users: { userId, otherUserId },
  });
  res.status(201).json({
    message: "Message created successfully",
    success: true,
    chatId: newChat._id,
  });
});

export const getAllChats = tryCatch(async () => {
  const userId = req.user?._id;
  if (!userId) {
    return res.status(400).json({
      message: "User not found",
    });
  }
  const chats = await Chat.find({ users: userId }).sort({ updatedAt: -1 });
  const chatWithUserData = await Promise.all(
    chats.map(async (chat) => {
      const otherUserId = chat.users.find((id) => id !== userId);
      const unSeencount = await messages.countDocument({
        chatId: chat._id,
        sender: { $ne: userId },
        seen: false,
      });

      try {
        const { data } = await axios.get(
          `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`,
        );
        return {
          user: data,
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unSeencount,
          },
        };
      } catch (error) {
        console.log(error);
        return {
          user: { _id: otherUserId, name: "unkownuser" },
          chat: {
            ...chat.toObject(),
            latestMessage: chat.latestMessage || null,
            unSeencount,
          },
        };
      }
    }),
  );

  res.json({
    chats: chatWithUserData,
  });
});

export const sendMessage = tryCatch(async (req, res) => {
  const senderid = req.user?._id;
  const { chatId, text } = req.body;
});
