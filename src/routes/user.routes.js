import { Router } from "express";
import * as userController from "../controllers/user.controller.js";
import {uploadAvatar} from "../config/multer.js";

const router = Router();

router.post("/", userController.createUser);
router.get("/", userController.getUsers);
router.get('/:id', userController.getUserById);
router.put("/:id",uploadAvatar.single("avatar"), userController.updateUser,);



export default router;
