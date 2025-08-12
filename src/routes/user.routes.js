import { Router } from "express";
import * as userController from "../controllers/user.controller.js";

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get('/:id', userController.getUserById);



export default router;
