import { Router } from "express";
export const router = Router();

import ChatManager from "../dao/ChatManager.js";
let chatManager = new ChatManager();

router.get("/", async (req, res) => {
  let mensajes = await chatManager.getMessages();

  res.setHeader("Content-Type", "application/json");
  res.status(200).json(mensajes);
});
