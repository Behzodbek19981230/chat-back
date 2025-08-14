import dotenv from "dotenv";
import http from "http";
import {Server} from "socket.io";
import app from "./app.js";
import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();
dotenv.config();

const PORT = process.env.PORT || 3000;
console.log(`Server port: ${PORT}`);

const server = http.createServer(app);

const io = new Server(server, {
    cors: {origin: "*"}
});

const onlineUsers = new Map(); // userId -> socketId

io.on("connection", (socket) => {
    console.log("Yangi client ulandi:", socket.id);

    // ====== ONLINE USERS ======
    socket.on("user-online", async (userId) => {
        onlineUsers.set(userId, socket.id);
        io.emit("online-users", Array.from(onlineUsers.keys()));
    });

    socket.on("disconnect", async () => {
        let disconnectedUserId = null;
        for (let [userId, sId] of onlineUsers) {
            if (sId === socket.id) {
                disconnectedUserId = userId;
                onlineUsers.delete(userId);
                break;
            }
        }
        if (disconnectedUserId) {
            await prisma.user.update({
                where: {id: Number(disconnectedUserId)},
                data: {lastSeen: new Date()}
            });
            io.emit("online-users", Array.from(onlineUsers.keys()));
        }
    });

    // ====== CHAT ======
    socket.on("join-chat", (chatId) => {
        socket.join(`chat_${chatId}`);
    });

    socket.on("leave-chat", (chatId) => {
        socket.leave(`chat_${chatId}`);
    });

    socket.on("send-message", (data) => {
        socket.to(`chat_${data.chatId}`).emit("receive-message", data);
    });

    // ====== AUDIO/VIDEO CALL ======

    // Call request
    socket.on("call-user", ({fromUserId, toUserId, media}) => {
        const toSocketId = onlineUsers.get(toUserId);
        console.log(`Call request from ${fromUserId} to ${toUserId} with media: ${media}`);
        if (toSocketId) {
            io.to(toSocketId).emit("incoming-call", {fromUserId, media});
        }
    });

    // Call answer
    socket.on("answer-call", ({fromUserId, toUserId, accept}) => {
        const toSocketId = onlineUsers.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit("call-answered", {fromUserId, accept});
        }
    });

    // WebRTC Offer
    socket.on("webrtc-offer", ({toUserId, offer}) => {
        const toSocketId = onlineUsers.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit("webrtc-offer", {offer});
        }
    });

    // WebRTC Answer
    socket.on("webrtc-answer", ({toUserId, answer}) => {
        const toSocketId = onlineUsers.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit("webrtc-answer", {answer});
        }
    });

    // ICE Candidates
    socket.on("webrtc-ice", ({toUserId, candidate}) => {
        const toSocketId = onlineUsers.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit("webrtc-ice", {candidate});
        }
    });

    // End Call
    socket.on("end-call", ({toUserId}) => {
        const toSocketId = onlineUsers.get(toUserId);
        if (toSocketId) {
            io.to(toSocketId).emit("call-ended");
        }
    });
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
