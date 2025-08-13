import * as messageService from "../services/message.service.js";


export const lastOwnMessage = async (req, res) => {
    const currentUserId = req.user.userId; // req.user ga middleware orqali foydalanuvchi ma'lumotlari qo'shilgan bo'lishi kerak
    if (!currentUserId) {
        return res.status(400).json({message: "Foydalanuvchi ID mavjud emas"});
    }


    const users = await messageService.lastMessage(currentUserId);
    res.json(users);
};

export const startChat = async (req, res) => {
    try {
        const {userId} = req.body;

        const chat = await messageService.getOrCreatePrivateChat(req.user.userId, userId);
        res.json(chat);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const sendMessage = async (req, res) => {
    try {
        const {chatId, content} = req.body;
        let contentValue;
        if (req.file) {
            // Fayl yuklangan bo‘lsa — URL sifatida
            contentValue = `/uploads/media/${req.file.filename}`;
        } else {
            // Matn bo‘lsa
            contentValue = text;
        }
        const message = await messageService.sendMessage(chatId, req.user.userId, contentValue);
        res.json(message);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getUserChats = async (req, res) => {
    try {
        const chats = await messageService.getUserChats(req.user.userId);
        res.json(chats);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};

export const getChatMessages = async (req, res) => {
    try {
        const {chatId} = req.params;
        console.log(`Chat ID: ${chatId}, User ID: ${req.user.userId}`);
        const messages = await messageService.getChatMessages(Number(chatId), req.user.userId);
        res.json(messages);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
};
export const getChatId = async (req, res) => {
    try {
        const {userId} = req.query;
        if (!userId) {
            return res.status(400).json({message: "userId so'rov parametri kerak"});
        }
        const chat = await messageService.getOrCreatePrivateChat(req.user.userId, Number(userId));
        res.json(chat);
    } catch (err) {
        res.status(500).json({error: err.message});
    }
}