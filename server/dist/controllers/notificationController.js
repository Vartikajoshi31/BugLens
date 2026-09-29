"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.markAllAsRead = exports.markAsRead = exports.getNotifications = void 0;
const Notification_js_1 = __importDefault(require("../models/Notification.js"));
const getNotifications = async (req, res) => {
    try {
        const notifications = await Notification_js_1.default.find({ recipient: req.user._id })
            .populate('actor', 'name avatar')
            .populate('bug', 'bugId title status')
            .sort({ createdAt: -1 })
            .limit(30);
        const unreadCount = await Notification_js_1.default.countDocuments({
            recipient: req.user._id,
            read: false,
        });
        res.json({ notifications, unreadCount });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getNotifications = getNotifications;
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;
        await Notification_js_1.default.findOneAndUpdate({ _id: id, recipient: req.user._id }, { read: true });
        res.json({ message: 'Notification marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAsRead = markAsRead;
const markAllAsRead = async (req, res) => {
    try {
        await Notification_js_1.default.updateMany({ recipient: req.user._id, read: false }, { read: true });
        res.json({ message: 'All notifications marked as read' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.markAllAsRead = markAllAsRead;
