import * as userService from "../services/user.service.js";

export const createUser = async (req, res) => {
    try {
        const {username} = req.body;
        const user = await userService.createUser(username);
        res.json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const getUsers = async (req, res) => {
    const {phone} = req.params;
    if (phone) {
        const user = await userService.getUserByPhone(phone);
        if (!user) {
            return res.status(404).json({message: "Foydalanuvchi topilmadi"});
        }
        res.json(user);
    }
    // Agar phone parametri bo'lmasa, barcha foydalanuvchilarni olish

    const users = await userService.getUsers();
    res.json(users);
};

export const getUserById = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await userService.getUserById(id);
        if (!user) {
            return res.status(404).json({message: "Foydalanuvchi topilmadi"});
        }
        res.json(user);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
export const updateUser = async (req, res) => {
    const {phone, fullName} = req.body;
    const {id} = req.params;
    try {
        let avatarPath = null;
        if (req.file) {
            avatarPath = `/uploads/avatars/${req.file.filename}`;
        }

        const updatedUser = await userService.updateUser(id, phone, fullName, avatarPath);

        res.json(updatedUser);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
}
