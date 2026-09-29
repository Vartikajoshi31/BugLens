import { Response } from 'express';
import Project from '../models/Project.js';
import Bug from '../models/Bug.js';
import Activity from '../models/Activity.js';
import { AuthRequest } from '../middleware/authMiddleware.js';

export const getProjects = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await Project.find({})
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role')
      .sort({ createdAt: -1 });

    res.json(projects);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    if (!project) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const totalBugs = await Bug.countDocuments({ project: id });
    const openBugs = await Bug.countDocuments({ project: id, status: 'OPEN' });
    const resolvedBugs = await Bug.countDocuments({ project: id, status: { $in: ['RESOLVED', 'CLOSED'] } });
    const inProgressBugs = await Bug.countDocuments({ project: id, status: 'IN PROGRESS' });

    const recentActivity = await Activity.find({ project: id })
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
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, key, description, members } = req.body;

    if (!name || !key) {
      res.status(400).json({ message: 'Project Name and Key are required' });
      return;
    }

    const existing = await Project.findOne({ key: key.toUpperCase() });
    if (existing) {
      res.status(400).json({ message: `Project Key '${key}' is already in use` });
      return;
    }

    const project = await Project.create({
      name,
      key: key.toUpperCase(),
      description: description || '',
      owner: req.user!._id,
      members: members || [req.user!._id],
    });

    const populated = await Project.findById(project._id)
      .populate('owner', 'name email avatar role')
      .populate('members', 'name email avatar role');

    res.status(201).json(populated);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
