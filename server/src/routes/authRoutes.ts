import { Router } from 'express';
import { registerUser, loginUser, getCurrentUser, getUsers } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getCurrentUser);
router.get('/users', protect, getUsers);

export default router;
