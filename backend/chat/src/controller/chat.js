import tryCatch from "../config/tryCatch.js";
import { Chat } from "../model/chat.js";
import { Messages } from "../model/Messages.js";
import axios from "axios";
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
    users: [userId, otherUserId],
  });
  res.status(201).json({
    message: "Message created successfully",
    success: true,
    chatId: newChat._id,
  });
});

export const getAllChats = tryCatch(async (req, res) => {
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
      const unSeencount = await Messages.countDocuments({
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
  const senderId = req.user?._id;
  const { chatId, text } = req.body;
  const imageFile = req.file;

  if (!senderId) {
    return res.status(404).json({
      message: "unauthorize",
    });
  }
  if (!chatId) {
    return res.status(400).json({
      message: "ChatId is required to establish connection",
    });
  }
  if (!text && !imageFile) {
    return res.status(400).json({
      message: "Message needed either text or image",
    });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(400).json({
      message: "Chat not found",
    });
  }
  const isUserinChat = chat.users.some(
    (userId) => userId.toString() === senderId.toString(),
  );
  if (!isUserinChat) {
    return res.status(403).json({
      message: "You are not the participent of this chat",
    });
  }

  const otheruserID = chat.users.find(
    (userId) => userId,
    toString() !== senderId.toString(),
  );
  if (!otheruserID) {
    return res.status(401).json({
      message: "No other user",
    });
  }

  let messageData = {
    chatId,
    senderId,
    seen: false,
    seenAt: undefined,
  };
  if (imageFile) {
    messageData.image = {
      url: imageFile.path,
      publicId: imageFile.filename,
    };
    messageData.messageType = "image";
    messageData.text = text || "";
  } else {
    messageData.text = text;
    messageData.messageType = "text";
  }
  const message = new Messages(messageData);
  const savedMessage = await message.save();
  const latestMessagetext = imageFile ? "image" : text;
  await Chat.findByIdAndUpdate(
    chatId,
    {
      latestMessage: {
        text: latestMessagetext,
        sender: senderId,
      },
      updatedAt: new Date(),
    },
    {
      new: true,
    },
  );
  return res.status(201).json({
    message: savedMessage,
    sender: senderId,
  });
});

export const getAllMessagesByChats = tryCatch(async (req, res) => {
  const userId = req.user?._id;
  const { chatId } = req.params;
  if (!chatId) {
    return res.status(400).json({
      message: "ChatId is required to establish connection",
    });
  }
  if (!userId) {
    return res.status(400).json({
      message: "Unauthorized user",
    });
  }

  const chat = await Chat.findById(chatId);
  if (!chat) {
    return res.status(400).json({
      message: "Chat not found",
    });
  }

  const isUserinChat = chat.users.some(
    (userId) => userId.toString() === userId.toString(),
  );
  if (!isUserinChat) {
    return res.status(400).json({
      message: "you are not a participent of the chat",
    });
  }
  const messageToMarkSeen = await Messages.find({
    chatId,
    sender: { $ne: userId },
    seen: false,
  });
  await Messages.updateMany(
    {
      chatId,
      sender: { $ne: userId },
      seen: false,
    },
    {
      seen: true,
      seenAt: new Date(),
    },
  );
  const messages = await Messages.findById(chatId).sort({
    createdAt: 1,
  });
  const otherUserId = chat.users.find((id) => id !== userId);
  try {
    const { data } = await axios.get(
      `${process.env.USER_SERVICE}/api/v1/user/${otherUserId}`,
    );

    if (!isUserinChat) {
      return res.status(400).json({
        message: "No user with this id",
      });
    }
    res.json({
      messages,
      data,
    });
  } catch (error) {
    return res.json({
        messages,
        user:{_id:otherUserId,name:"unknown user"}
      });
  }
});
