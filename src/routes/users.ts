import { Router } from 'express';
import {
  getAllUsers,
  findUserById,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getAllUsers);
router.get('/users/:userId', findUserById);
router.post('/users', createUser);
router.patch('/users/me', updateUserInfo);
router.patch('/users/me/avatar', updateUserAvatar);

export default router;
