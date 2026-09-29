import { Response } from 'express';
import Comment from '../models/Comment.js';
import Bug from '../models/Bug.js';
import User from '../models/User.js';
import Activity from '../models/Activity.js';
import Notification from '../models/Notification.js';
import { AuthRequest } from '../middleware/authMiddleware.js';
import { emitEvent } from '../services/socketService.js';

export const getCommentsByBug = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bugId } = req.params;
    const bug = await Bug.findOne({ $or: [{ _id: bugId.match(/^[0-9a-fA-F]{24}$/) ? bugId : null }, { bugId }] });

    if (!bug) {
      res.status(404).json({ message: 'Bug not found' });
      return;
    }

    const comments = await Comment.find({ bug: bug._id })
      .populate('author', 'name email avatar role')
      .populate('mentions', 'name email avatar')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const createComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { bugId } = req.params;
    const { text } = req.body;

    if (!text || text.trim() === '') {
      res.status(400).json({ message: 'Comment text cannot be empty' });
      return;
    }

    const bug = await Bug.findOne({ $or: [{ _id: bugId.match(/^[0-9a-fA-F]{24}$/) ? bugId : null }, { bugId }] });
    if (!bug) {
      res.status(404).json({ message: 'Bug not found' });
      return;
    }

    // Extract @mentions
    const mentionMatches = text.match(/@(\w+)/g) || [];
    const mentionUsernames = mentionMatches.map((m: string) => m.substring(1));

    const mentionedUsers = await User.find({
      name: { $in: mentionUsernames.map((u: string) => new RegExp(`^${u}$`, 'i')) },
    });

    const mentionIds = mentionedUsers.map((u) => u._id);

    const comment = await Comment.create({
      bug: bug._id,
      author: req.user!._id,
      text,
      mentions: mentionIds,
    });

    const populatedComment = await Comment.findById(comment._id)
      .populate('author', 'name email avatar role')
      .populate('mentions', 'name email avatar');

    // Activity
    await Activity.create({
      bug: bug._id,
      project: bug.project,
      actor: req.user!._id,
      action: `commented on ${bug.bugId}`,
    });

    // Notify mentioned users
    for (const mentionedUser of mentionedUsers) {
      if (mentionedUser._id.toString() !== req.user!._id.toString()) {
        await Notification.create({
          recipient: mentionedUser._id,
          actor: req.user!._id,
          type: 'MENTION',
          bug: bug._id,
          message: `${req.user!.name} mentioned you in a comment on ${bug.bugId}`,
        });
      }
    }

    // Notify assignee if set and not author
    const assigneeId = bug.assignee ? bug.assignee.toString() : null;
    if (assigneeId && assigneeId !== req.user!._id.toString() && !mentionIds.some(id => id.toString() === assigneeId)) {
      await Notification.create({
        recipient: bug.assignee,
        actor: req.user!._id,
        type: 'COMMENT',
        bug: bug._id,
        message: `${req.user!.name} commented on ${bug.bugId}`,
      });
    }

    emitEvent('comment:created', { bugId: bug._id, comment: populatedComment });

    res.status(201).json(populatedComment);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteComment = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const comment = await Comment.findById(id);

    if (!comment) {
      res.status(404).json({ message: 'Comment not found' });
      return;
    }

    if (comment.author.toString() !== req.user!._id.toString() && req.user!.role !== 'Admin') {
      res.status(403).json({ message: 'Not authorized to delete this comment' });
      return;
    }

    await comment.deleteOne();
    emitEvent('comment:deleted', { id, bugId: comment.bug });

    res.json({ message: 'Comment deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
