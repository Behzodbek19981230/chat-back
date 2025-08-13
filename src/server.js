import dotenv from "dotenv";
import http from "http";
import { Server } from "socket.io";
import app from "./app.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
dotenv.config();

const PORT = process.env.PORT || 3000;
console.log(`Server port: ${PORT}`);

// Express appdan HTTP server yaratamiz
const server = http.createServer(app);


const io = new Server(server, {
    cors: { origin: "*" }
});

const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
    console.log("Yangi client ulandi:", socket.id);

    // Foydalanuvchi login qilganda userId ni jo‘natadi
    socket.on("user-online", async (userId) => {
        onlineUsers.set(userId, socket.id);

        // Barcha userlarga online ro‘yxatni jo‘natish
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    // Disconnect bo‘lganda
    socket.on("disconnect", async () => {
        let disconnectedUserId = null;

        // O‘chirilgan socketId qaysi userga tegishli ekanini topamiz
        for (let [userId, sId] of onlineUsers) {
            if (sId === socket.id) {
                disconnectedUserId = userId;
                onlineUsers.delete(userId);
                break;
            }
        }

        if (disconnectedUserId) {
            // lastSeen ni yangilash
            await prisma.user.update({
                where: { id: Number(disconnectedUserId) },
                data: { lastSeen: new Date() }
            });

            // Yangilangan online ro‘yxatni jo‘natish
            io.emit("online-users", Array.from(onlineUsers.keys()));
        }
    });
    // Chatga qo‘shilish
    socket.on("join-chat", (chatId) => {
        console.log(`Foydalanuvchi ${socket.id} chatga qo'shildi: ${chatId}`);
        socket.join(`chat_${chatId}`);
    });
    // Chatdan chiqish
    socket.on("leave-chat", (chatId) => {
        socket.leave(`chat_${chatId}`);
    });


    // Xabar yuborish

    socket.on("send-message", (data) => {
        // Xabarni boshqa foydalanuvchilarga yuborish
        console.log(`Xabar yuborildi: ${data.content} (Chat ID: ${data.chatId})`);
        socket.to(`chat_${data.chatId}`).emit("receive-message", data);
    });
    // Xabarlarni olish

});



server.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`❌ Port ${PORT} allaqachon band`);
    } else {
        console.error(err);
    }
});

