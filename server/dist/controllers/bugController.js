"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadScreenshot = exports.deleteBug = exports.updateBug = exports.createBug = exports.getBugById = exports.getBugs = void 0;
const Bug_js_1 = __importDefault(require("../models/Bug.js"));
const Activity_js_1 = __importDefault(require("../models/Activity.js"));
const Notification_js_1 = __importDefault(require("../models/Notification.js"));
const Project_js_1 = __importDefault(require("../models/Project.js"));
const socketService_js_1 = require("../services/socketService.js");
const getBugs = async (req, res) => {
    try {
        const { status, severity, priority, assignee, reporter, project, search } = req.query;
        const filter = {};
        if (status)
            filter.status = status;
        if (severity)
            filter.severity = severity;
        if (priority)
            filter.priority = priority;
        if (assignee)
            filter.assignee = assignee;
        if (reporter)
            filter.reporter = reporter;
        if (project)
            filter.project = project;
        if (search && typeof search === 'string' && search.trim() !== '') {
            const regex = new RegExp(search.trim(), 'i');
            filter.$or = [
                { bugId: regex },
                { title: regex },
                { description: regex },
                { labels: regex },
            ];
        }
        const bugs = await Bug_js_1.default.find(filter)
            .populate('reporter', 'name email avatar role')
            .populate('assignee', 'name email avatar role')
            .populate('project', 'name key')
            .sort({ updatedAt: -1 });
        res.json(bugs);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBugs = getBugs;
const getBugById = async (req, res) => {
    try {
        const { id } = req.params;
        let bug = await Bug_js_1.default.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bugId: id }] })
            .populate('reporter', 'name email avatar role')
            .populate('assignee', 'name email avatar role')
            .populate('project', 'name key description');
        if (!bug) {
            res.status(404).json({ message: 'Bug not found' });
            return;
        }
        res.json(bug);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getBugById = getBugById;
const createBug = async (req, res) => {
    try {
        const { title, description, severity, priority, status, assignee, project: projectId, labels, environment, reproduction, screenshotUrl, attachments, } = req.body;
        if (!title || !projectId) {
            res.status(400).json({ message: 'Title and Project are required' });
            return;
        }
        const projectObj = await Project_js_1.default.findById(projectId);
        if (!projectObj) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        const count = await Bug_js_1.default.countDocuments({ project: projectId });
        const bugId = `${projectObj.key}-${1001 + count}`;
        const newBug = await Bug_js_1.default.create({
            bugId,
            title,
            description,
            severity: severity || 'MEDIUM',
            priority: priority || 'NORMAL',
            status: status || 'OPEN',
            reporter: req.user._id,
            assignee: assignee || null,
            project: projectId,
            labels: labels || [],
            environment: environment || {},
            reproduction: reproduction || {},
            screenshotUrl: screenshotUrl || '',
            attachments: attachments || [],
        });
        const populatedBug = await Bug_js_1.default.findById(newBug._id)
            .populate('reporter', 'name email avatar role')
            .populate('assignee', 'name email avatar role')
            .populate('project', 'name key');
        // Create activity
        await Activity_js_1.default.create({
            bug: newBug._id,
            project: projectId,
            actor: req.user._id,
            action: `created bug ${bugId}`,
        });
        // Notify assignee if set
        if (assignee && assignee.toString() !== req.user._id.toString()) {
            await Notification_js_1.default.create({
                recipient: assignee,
                actor: req.user._id,
                type: 'BUG_ASSIGNED',
                bug: newBug._id,
                message: `${req.user.name} assigned you to ${bugId}: ${title}`,
            });
        }
        (0, socketService_js_1.emitEvent)('bug:created', populatedBug);
        res.status(201).json(populatedBug);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createBug = createBug;
const updateBug = async (req, res) => {
    try {
        const { id } = req.params;
        const existingBug = await Bug_js_1.default.findById(id);
        if (!existingBug) {
            res.status(404).json({ message: 'Bug not found' });
            return;
        }
        const oldStatus = existingBug.status;
        const oldAssignee = existingBug.assignee?.toString();
        const updatedBug = await Bug_js_1.default.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true })
            .populate('reporter', 'name email avatar role')
            .populate('assignee', 'name email avatar role')
            .populate('project', 'name key');
        if (!updatedBug) {
            res.status(404).json({ message: 'Bug update failed' });
            return;
        }
        // Activity tracking
        if (req.body.status && req.body.status !== oldStatus) {
            await Activity_js_1.default.create({
                bug: updatedBug._id,
                project: updatedBug.project,
                actor: req.user._id,
                action: `changed status from ${oldStatus} to ${req.body.status}`,
            });
            const reporterObj = updatedBug.reporter;
            if (reporterObj && reporterObj._id && reporterObj._id.toString() !== req.user._id.toString()) {
                await Notification_js_1.default.create({
                    recipient: reporterObj._id,
                    actor: req.user._id,
                    type: req.body.status === 'RESOLVED' ? 'BUG_RESOLVED' : 'STATUS_CHANGE',
                    bug: updatedBug._id,
                    message: `${req.user.name} changed ${updatedBug.bugId} status to ${req.body.status}`,
                });
            }
        }
        if (req.body.assignee && req.body.assignee.toString() !== oldAssignee) {
            const newAssignee = updatedBug.assignee;
            await Activity_js_1.default.create({
                bug: updatedBug._id,
                project: updatedBug.project,
                actor: req.user._id,
                action: `assigned bug to ${newAssignee ? newAssignee.name : 'unassigned'}`,
            });
            if (req.body.assignee.toString() !== req.user._id.toString()) {
                await Notification_js_1.default.create({
                    recipient: req.body.assignee,
                    actor: req.user._id,
                    type: 'BUG_ASSIGNED',
                    bug: updatedBug._id,
                    message: `${req.user.name} assigned you to ${updatedBug.bugId}`,
                });
            }
        }
        (0, socketService_js_1.emitEvent)('bug:updated', updatedBug);
        res.json(updatedBug);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.updateBug = updateBug;
const deleteBug = async (req, res) => {
    try {
        const { id } = req.params;
        const bug = await Bug_js_1.default.findByIdAndDelete(id);
        if (!bug) {
            res.status(404).json({ message: 'Bug not found' });
            return;
        }
        (0, socketService_js_1.emitEvent)('bug:deleted', { id });
        res.json({ message: 'Bug removed successfully' });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.deleteBug = deleteBug;
const uploadScreenshot = async (req, res) => {
    try {
        if (!req.file) {
            res.status(400).json({ message: 'No file uploaded' });
            return;
        }
        const fileUrl = `/uploads/${req.file.filename}`;
        res.status(201).json({ url: fileUrl });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.uploadScreenshot = uploadScreenshot;
