"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProject = exports.getProjectById = exports.getProjects = void 0;
const Project_js_1 = __importDefault(require("../models/Project.js"));
const Bug_js_1 = __importDefault(require("../models/Bug.js"));
const Activity_js_1 = __importDefault(require("../models/Activity.js"));
const getProjects = async (_req, res) => {
    try {
        const projects = await Project_js_1.default.find({})
            .populate('owner', 'name email avatar role')
            .populate('members', 'name email avatar role')
            .sort({ createdAt: -1 });
        res.json(projects);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProjects = getProjects;
const getProjectById = async (req, res) => {
    try {
        const { id } = req.params;
        const project = await Project_js_1.default.findById(id)
            .populate('owner', 'name email avatar role')
            .populate('members', 'name email avatar role');
        if (!project) {
            res.status(404).json({ message: 'Project not found' });
            return;
        }
        const totalBugs = await Bug_js_1.default.countDocuments({ project: id });
        const openBugs = await Bug_js_1.default.countDocuments({ project: id, status: 'OPEN' });
        const resolvedBugs = await Bug_js_1.default.countDocuments({ project: id, status: { $in: ['RESOLVED', 'CLOSED'] } });
        const inProgressBugs = await Bug_js_1.default.countDocuments({ project: id, status: 'IN PROGRESS' });
        const recentActivity = await Activity_js_1.default.find({ project: id })
            .populate('actor', 'name avatar')
            .populate('bug', 'bugId title')
            .sort({ createdAt: -1 })
            .limit(10);
        res.json({
            project,
            stats: {
                totalBugs,
                openBugs,
                resolvedBugs,
                inProgressBugs,
            },
            recentActivity,
        });
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getProjectById = getProjectById;
const createProject = async (req, res) => {
    try {
        const { name, key, description, members } = req.body;
        if (!name || !key) {
            res.status(400).json({ message: 'Project Name and Key are required' });
            return;
        }
        const existing = await Project_js_1.default.findOne({ key: key.toUpperCase() });
        if (existing) {
            res.status(400).json({ message: `Project Key '${key}' is already in use` });
            return;
        }
        const project = await Project_js_1.default.create({
            name,
            key: key.toUpperCase(),
            description: description || '',
            owner: req.user._id,
            members: members || [req.user._id],
        });
        const populated = await Project_js_1.default.findById(project._id)
            .populate('owner', 'name email avatar role')
            .populate('members', 'name email avatar role');
        res.status(201).json(populated);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.createProject = createProject;
