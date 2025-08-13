import express from "express";
import userRoutes from "./routes/user.routes.js";
import authRoutes from "./routes/auth.routes.js";
import {authMiddleware} from "./middleware/authMiddleware.js";
import cors from "cors";
import messageRoutes from "./routes/message.routes.js";

const app = express();
// CORS sozlash
app.use(
    cors({
        origin: "*", // Next.js frontend URL
        credentials: true, // cookie/token yuborish uchun
    })
);
app.use(express.json());
app.use("/uploads", express.static("uploads"));


// Routes
app.use("/api/auth", authRoutes);   // Auth API
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/messages", authMiddleware, messageRoutes);

export default app;
