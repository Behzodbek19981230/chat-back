import prisma from "../config/db.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "secret";

export const register = async (fullName, phone, password, avatar) => {
    const existing = await prisma.user.findUnique({ where: { phone } });
    if (existing) throw new Error("Bu telefon raqam allaqachon ro'yxatdan o'tgan");

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
        data: { fullName, phone, password: hashedPassword, avatar }
    });

    return user;
};

export const login = async (phone, password) => {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) throw new Error("Foydalanuvchi topilmadi");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Parol noto'g'ri");

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: "7d" });

    return { token, user };
};

export  const getUserById= async (id) => {
    const user = await prisma.user.findUnique({
        where: { id: parseInt(id) }
    });
    if (!user) throw new Error("Foydalanuvchi topilmadi");
    return user;
}
