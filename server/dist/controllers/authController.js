"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUsers = exports.getCurrentUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_js_1 = __importDefault(require("../models/User.js"));
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const registerUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Please provide all required fields (name, email, password)' });
            return;
        }
        const existingUser = await User_js_1.default.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: 'User with this email already exists' });
            return;
        }
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const avatar = `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
        const user = await User_js_1.default.create({
            name,
            email,
            password: hashedPassword,
            avatar,
            role: role || 'QA Tester',
        });
        const token = (0, authMiddleware_js_1.generateToken)(user._id.toString());
        res.status(201).json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server error during registration' });
    }
};
exports.registerUser = registerUser;
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Please provide email and password' });
            return;
        }
        const user = await User_js_1.default.findOne({ email });
        if (!user) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const isMatch = await bcryptjs_1.default.compare(password, user.password || '');
        if (!isMatch) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = (0, authMiddleware_js_1.generateToken)(user._id.toString());
        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                role: user.role,
            },
            token,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message || 'Server error during login' });
    }
};
exports.loginUser = loginUser;
const getCurrentUser = async (req, res) => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authenticated' });
        return;
    }
    res.json({ user: req.user });
};
exports.getCurrentUser = getCurrentUser;
const getUsers = async (_req, res) => {
    try {
        const users = await User_js_1.default.find({}).select('-password').sort({ name: 1 });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getUsers = getUsers;
