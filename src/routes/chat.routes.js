import express from "express";

import * as chatService from "../services/chat.service.js";

const router = express.Router();
router.get("/chats",  chatService.getUserChats);
router.get("/:chatId/messages",  chatService.getChatMessages);


export default router;
