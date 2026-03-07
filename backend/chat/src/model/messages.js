import mongoose, { model, Schema } from "mongoose";

const messageSchema = new Schema({
  chatId: {
    type: Schema.Types.ObjectId,
    ref: "Chat",
    required: true,
  },
  senderId: {
    type: String,
    required: true,
  },
  text: String,

  image: {
    url: String,
    publicId: String,
  },
  messageType: {
    type: String,
    enum: ["text", "image"],
    default: "text",
  },
  seen: {
    type: Boolean,
    default: null,
  },
  seenAt: {
    type: Date,
    default: null,
  },
},{
    timestamps:true
});

export const Messages = mongoose.model("message", messageSchema);
