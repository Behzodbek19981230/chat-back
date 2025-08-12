import { Router } from "express";
import * as authController from "../controllers/auth.controller.js";
import {authMiddleware} from "../middleware/authMiddleware.js";

const router = Router();

// Ro'yxatdan o'tish
router.post("/register", authController.register);

// Login
router.post("/login", authController.login);

// Foydalanuvchi profili
router.get("/me", authMiddleware, authController.profile);

export default router;
