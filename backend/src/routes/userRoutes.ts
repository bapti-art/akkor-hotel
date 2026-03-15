import { Router } from 'express';
import {
  getMe,
  getUserById,
  getAllUsers,
  updateUser,
  deleteUser,
} from '../controllers/userController';
import { authenticate } from '../middleware/auth';
import { validate, updateUserSchema } from '../middleware/validation';

const router = Router();

router.get('/me', authenticate, getMe);
router.get('/', authenticate, getAllUsers);
router.get('/:id', authenticate, getUserById);
router.put('/:id', authenticate, validate(updateUserSchema), updateUser);
router.delete('/:id', authenticate, deleteUser);
 
export default router;
