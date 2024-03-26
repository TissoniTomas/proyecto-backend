import mongoose from "mongoose";

const chatColl = "chat";
const chatSchema = new mongoose.Schema(
  {
    user: String,
    message: String
  },
  {
    timestamps: true,
  }
);

export const modelChat = mongoose.model(chatColl, chatSchema);
