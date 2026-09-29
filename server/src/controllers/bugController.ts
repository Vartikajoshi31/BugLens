import { Response } from 'express';
import Bug from '../models/Bug.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import Project from '../models/Project.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { emitEvent } from '../services/socketService.js';

export const getBugs = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, severity, priority, assignee, reporter, project, search } = req.query;

    const filter: any = {};

    if (status) filter.status = status;
    if (severity) filter.severity = severity;
    if (priority) filter.priority = priority;
    if (assignee) filter.assignee = assignee;
    if (reporter) filter.reporter = reporter;
    if (project) filter.project = project;

    if (search && typeof search === 'string' && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { bugId: regex },
        { title: regex },
        { description: regex },
        { labels: regex },
      ];
    }

    const bugs = await Bug.find(filter)
      .populate('reporter', 'name email avatar role')
      .populate('assignee', 'name email avatar role')
      .populate('project', 'name key')
      .sort({ updatedAt: -1 });

    res.json(bugs);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getBugById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    let bug = await Bug.findOne({ $or: [{ _id: id.match(/^[0-9a-fA-F]{24}$/) ? id : null }, { bugId: id }] })
      .populate('reporter', 'name email avatar role')
      .populate('assignee', 'name email avatar role')
      .populate('project', 'name key description');

    if (!bug) {
      res.status(404).json({ message: 'Bug not found' });
      return;
    }

    res.json(bug);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createBug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title,
      description,
      severity,
      priority,
      status,
      assignee,
      project: projectId,
      labels,
      environment,
      reproduction,
      screenshotUrl,
      attachments,
    } = req.body;

    if (!title || !projectId) {
      res.status(400).json({ message: 'Title and Project are required' });
      return;
    }

    const projectObj = await Project.findById(projectId);
    if (!projectObj) {
      res.status(404).json({ message: 'Project not found' });
      return;
    }

    const count = await Bug.countDocuments({ project: projectId });
    const bugId = `${projectObj.key}-${1001 + count}`;

    const newBug = await Bug.create({
      bugId,
      title,
      description,
      severity: severity || 'MEDIUM',
      priority: priority || 'NORMAL',
      status: status || 'OPEN',
      reporter: req.user!._id,
      assignee: assignee || null,
      project: projectId,
      labels: labels || [],
      environment: environment || {},
      reproduction: reproduction || {},
      screenshotUrl: screenshotUrl || '',
      attachments: attachments || [],
    });

    const populatedBug = await Bug.findById(newBug._id)
      .populate('reporter', 'name email avatar role')
      .populate('assignee', 'name email avatar role')
      .populate('project', 'name key');

    // Create activity
    await Activity.create({
      bug: newBug._id,
      project: projectId,
      actor: req.user!._id,
      action: `created bug ${bugId}`,
    });

    // Notify assignee if set
    if (assignee && assignee.toString() !== req.user!._id.toString()) {
      await Notification.create({
        recipient: assignee,
        actor: req.user!._id,
        type: 'BUG_ASSIGNED',
        bug: newBug._id,
        message: `${req.user!.name} assigned you to ${bugId}: ${title}`,
      });
    }

    emitEvent('bug:created', populatedBug);

    res.status(201).json(populatedBug);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const updateBug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existingBug = await Bug.findById(id);

    if (!existingBug) {
      res.status(404).json({ message: 'Bug not found' });
      return;
    }

    const oldStatus = existingBug.status;
    const oldAssignee = existingBug.assignee?.toString();

    const updatedBug = await Bug.findByIdAndUpdate(id, { $set: req.body }, { new: true, runValidators: true })
      .populate('reporter', 'name email avatar role')
      .populate('assignee', 'name email avatar role')
      .populate('project', 'name key');

    if (!updatedBug) {
      res.status(404).json({ message: 'Bug update failed' });
      return;
    }

    // Activity tracking
    if (req.body.status && req.body.status !== oldStatus) {
      await Activity.create({
        bug: updatedBug._id,
        project: updatedBug.project,
        actor: req.user!._id,
        action: `changed status from ${oldStatus} to ${req.body.status}`,
      });

      const reporterObj = updatedBug.reporter as any;
      if (reporterObj && reporterObj._id && reporterObj._id.toString() !== req.user!._id.toString()) {
        await Notification.create({
          recipient: reporterObj._id,
          actor: req.user!._id,
          type: req.body.status === 'RESOLVED' ? 'BUG_RESOLVED' : 'STATUS_CHANGE',
          bug: updatedBug._id,
          message: `${req.user!.name} changed ${updatedBug.bugId} status to ${req.body.status}`,
        });
      }
    }

    if (req.body.assignee && req.body.assignee.toString() !== oldAssignee) {
      const newAssignee = updatedBug.assignee as any;
      await Activity.create({
        bug: updatedBug._id,
        project: updatedBug.project,
        actor: req.user!._id,
        action: `assigned bug to ${newAssignee ? newAssignee.name : 'unassigned'}`,
      });

      if (req.body.assignee.toString() !== req.user!._id.toString()) {
        await Notification.create({
          recipient: req.body.assignee,
          actor: req.user!._id,
          type: 'BUG_ASSIGNED',
          bug: updatedBug._id,
          message: `${req.user!.name} assigned you to ${updatedBug.bugId}`,
        });
      }
    }

    emitEvent('bug:updated', updatedBug);

    res.json(updatedBug);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteBug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const bug = await Bug.findByIdAndDelete(id);

    if (!bug) {
      res.status(404).json({ message: 'Bug not found' });
      return;
    }

    emitEvent('bug:deleted', { id });
    res.json({ message: 'Bug removed successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadScreenshot = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({ message: 'No file uploaded' });
      return;
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    res.status(201).json({ url: fileUrl });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
