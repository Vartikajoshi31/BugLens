"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.createComment = exports.getCommentsByBug = void 0;
const Comment_js_1 = __importDefault(require("../models/Comment.js"));
const Bug_js_1 = __importDefault(require("../models/Bug.js"));
const User_js_1 = __importDefault(require("../models/User.js"));
const Activity_js_1 = __importDefault(require("../models/Activity.js"));
const Notification_js_1 = __importDefault(require("../models/Notification.js"));
const socketService_js_1 = require("../services/socketService.js");
const getCommentsByBug = async (req, res) => {
    try {
        const { bugId } = req.params;
        const bug = await Bug_js_1.default.findOne({ $or: [{ _id: bugId.match(/^[0-9a-fA-F]{24}$/) ? bugId : null }, { bugId }] });
        if (!bug) {
            res.status(404).json({ message: 'Bug not found' });
            return;
        }
        const comments = await Comment_js_1.default.find({ bug: bug._id })
            .populate('author', 'name email avatar role')
            .populate('mentions', 'name email avatar')
            .sort({ createdAt: 1 });
        res.json(comments);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getCommentsByBug = getCommentsByBug;
const createComment = async (req, res) => {
    try {
        const { bugId } = req.params;
        const { text } = req.body;
        if (!text || text.trim() === '') {
            res.status(400).json({ message: 'Comment text cannot be empty' });
            return;
        }
        const bug = await Bug_js_1.default.findOne({ $or: [{ _id: bugId.match(/^[0-9a-fA-F]{24}$/) ? bugId : null }, { bugId }] });
        if (!bug) {
            res.status(404).json({ message: 'Bug not found' });
            return;
        }
        // Extract @mentions
        const mentionMatches = text.match(/@(\w+)/g) || [];
        const mentionUsernames = mentionMatches.map((m) => m.substring(1));
        const mentionedUsers = await User_js_1.default.find({
            name: { $in: mentionUsernames.map((u) => new RegExp(`^${u}$`, 'i')) },
        });
        const mentionIds = mentionedUsers.map((u) => u._id);
        const comment = await Comment_js_1.default.create({
            bug: bug._id,
            author: req.user._id,
            text,
            mentions: mentionIds,
        });
        const populatedComment = await Comment_js_1.default.findById(comment._id)
            .populate('author', 'name email avatar role')
            .populate('mentions', 'name email avatar');
        // Activity
        await Activity_js_1.default.create({
            bug: bug._id,
            project: bug.project,
            actor: req.user._id,
            action: `commented on ${bug.bugId}`,
        });
        // Notify mentioned users
        for (const mentionedUser of mentionedUsers) {
            if (mentionedUser._id.toString() !== req.user._id.toString()) {
                await Notification_js_1.default.create({
                    recipient: mentionedUser._id,
                    actor: req.user._id,
                    type: 'MENTION',
                    bug: bug._id,
                    message: `${req.user.name} mentioned you in a comment on ${bug.bugId}`,
                });
            }
        }
        // Notify assignee if set and not author
        const assigneeId = bug.assignee ? bug.assignee.toString() : null;
        if (assigneeId && assigneeId !== req.user._id.toString() && !mentionIds.some(id => id.toString() === assigneeId)) {
            await Notification_js_1.default.create({
                recipient: bug.assignee,
                actor: req.user._id,
                type: 'COMMENT',
                bug: bug._id,
                message: `${req.user.name} commented on ${bug.bugId}`,
            });
        }
        (0, socketService_js_1.emitEvent)('comment:created', { bugId: bug._id, comment: populatedComment });
        res.status(201).json(populatedComment);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createComment = createComment;
const deleteComment = async (req, res) => {
    try {
        const { id } = req.params;
        const comment = await Comment_js_1.default.findById(id);
        if (!comment) {
            res.status(404).json({ message: 'Comment not found' });
            return;
        }
        if (comment.author.toString() !== req.user._id.toString() && req.user.role !== 'Admin') {
            res.status(403).json({ message: 'Not authorized to delete this comment' });
            return;
        }
        await comment.deleteOne();
        (0, socketService_js_1.emitEvent)('comment:deleted', { id, bugId: comment.bug });
        res.json({ message: 'Comment deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteComment = deleteComment;
