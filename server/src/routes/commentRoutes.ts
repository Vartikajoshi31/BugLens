import { Router } from 'express';
import { getCommentsByBug, createComment, deleteComment } from '../controllers/commentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect);

router.get('/bug/:bugId', getCommentsByBug);
router.post('/bug/:bugId', createComment);
router.delete('/:id', deleteComment);

export default router;
