import { Router } from 'express';
import Joi from 'joi';
import { celebrate } from 'celebrate';
import { linkRegex } from '../utils/constants';
import {
  getAllUsers,
  findUserById,
  getUserInfo,
  updateUserInfo,
  updateUserAvatar,
} from '../controllers/users';

const router = Router();

router.get('/users', getAllUsers);

router.get('/users/me', getUserInfo);

router.get('/users/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), findUserById);

router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/users/me/avatar', celebrate({
  body: Joi.object().keys({
    /* eslint-disable-next-line */
    avatar: Joi.string().pattern(linkRegex),
  }),
}), updateUserAvatar);

export default router;
