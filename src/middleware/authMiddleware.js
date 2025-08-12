import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
    try {
        // Authorization header'ni olish
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token topilmadi" });
        }

        const token = authHeader.split(" ")[1];

        // Tokenni tekshirish
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Token ichidan user ma'lumotlarini olish
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Token yaroqsiz yoki muddati tugagan" });
    }
};
