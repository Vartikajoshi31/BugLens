import { Router } from 'express';
import {
  getBugs,
  getBugById,
  createBug,
  updateBug,
  deleteBug,
  uploadScreenshot,
} from '../controllers/bugController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { upload } from '../middleware/uploadMiddleware.js';

const router = Router();

router.use(protect);

router.get('/', getBugs);
router.post('/', createBug);
router.post('/upload-screenshot', upload.single('screenshot'), uploadScreenshot);
router.get('/:id', getBugById);
router.put('/:id', updateBug);
router.delete('/:id', authorize('Admin'), deleteBug);

export default router;
