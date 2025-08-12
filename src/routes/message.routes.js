import express from "express";

import * as messageController from "../controllers/message.controller.js";

const router = express.Router();
router.get("/last-own", messageController.lastOwnMessage);
router.post("/start",  messageController.startChat);
router.post("/send",  messageController.sendMessage);
router.get("/chats",  messageController.getUserChats);
router.get("/:chatId/messages",  messageController.getChatMessages);
router.get("/chat",messageController.getChatId)


export default router;
