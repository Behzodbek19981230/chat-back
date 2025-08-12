import * as authService from "../services/auth.service.js";

export const register = async (req, res) => {
    console.log("Register endpoint hit");
    try {
        const { fullName, phone, password, avatar } = req.body;
        if (!fullName || !phone || !password) {
            return res.status(400).json({ message: "Full name, phone va password majburiy" });
        }
        const user = await authService.register(fullName, phone, password, avatar);
        res.status(201).json({ message: "Ro'yxatdan o'tildi", user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const { phone, password } = req.body;
        const { token, user } = await authService.login(phone, password);
        res.json({ token, user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
export  const profile = async (req, res) => {
    try {
        const user = req.user;
        // req.user ga middleware orqali foydalanuvchi ma'lumotlari qo'shilgan bo'lishi kerak
        const userData= await authService.getUserById(user.userId);
        res.json(userData);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
}
