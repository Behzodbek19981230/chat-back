
import prisma from "../config/db.js";

// Chat ro‘yxatini olish
export const getUserChats = async (userId) => {
    const chats = await prisma.chat.findMany({
        where: {
            participants: { some: { userId } }
        },
        include: {
            participants: {
                include: { user: true }
            },
            messages: {
                orderBy: { createdAt: "desc" },
                take: 1
            }
        }
    });

    return chats.map(chat => ({
        id: chat.id,
        userId: chat.participants.find(p => p.userId !== userId)?.userId || null,
        isGroup: chat.isGroup,
        title: chat.isGroup
            ? chat.title
            : chat.participants.find(p => p.userId !== userId)?.user.fullName,
        avatar: chat.isGroup
            ? chat.avatar
            : chat.participants.find(p => p.userId !== userId)?.user.avatar,
        lastMessage: chat.messages[0]?.content || "",
        lastMessageTime: chat.messages[0]?.createdAt || null,
        unreadCount: chat.participants.find(p => p.userId === userId)?.unreadCount || 0
    }));
};

// Chatdagi xabarlarni olish
export const getChatMessages = async (chatId, userId) => {
    // O‘qilmagan xabarlarni nolga tushirish
    await prisma.chatUser.updateMany({
        where: { chatId, userId },
        data: { unreadCount: 0 }
    });

    return prisma.message.findMany({
        where: { chatId },
        orderBy: { createdAt: "asc" }
    });
};
export const sendMessage = async (chatId, senderId, content) => {
    const message = await prisma.message.create({
        data: { chatId, senderId, content, readBy: [senderId] }
    });

    // Qabul qiluvchida unread count ni oshirish
    await prisma.chatUser.updateMany({
        where: {
            chatId,
            userId: { not: senderId }
        },
        data: { unreadCount: { increment: 1 } }
    });

    return message;
};
// Private chat yaratish yoki mavjudini olish
export const getOrCreatePrivateChat = async (userId1, userId2) => {
    // Mavjud chatni qidirish
    if( userId1 === userId2) {
        throw new Error("Foydalanuvchi o'ziga xabar yubora olmaydi");
    }


    let chat = await prisma.chat.findFirst({
        where: {
            isGroup: false,
            participants: {
                every: {
                    userId: { in: [userId1, userId2] }
                }
            }
        }
    });

    // Agar yo‘q bo‘lsa — yaratamiz

    if (!chat) {
        chat = await prisma.chat.create({
            data: {
                isGroup: false,
                participants: {
                    create: [
                        { userId: userId1 },
                        { userId: userId2 }
                    ]
                }
            }
        });
    }

    return chat;
};

export const lastMessage = async (currentUserId) => {


   return await prisma.chat.findMany({
        where: {participants: {some: {userId: currentUserId}}},
        include: {
            messages: {orderBy: {createdAt: 'desc'}, take: 1},
            participants: {include: {user: true}}
        }
    })
}
