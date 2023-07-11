import { Request, Response } from 'express';
import User, { IUser } from '../models/user';
import { STATUS_400, STATUS_404, STATUS_500 } from '../utils/constants';

interface IRequest extends Request {
  user?: {
    _id: string
  }
}

export const getAllUsers = (req: Request, res: Response): void => {
  User.find({})
    .then((user) => res.send({ data: user }))
    .catch(() => res.status(STATUS_500).send({ message: 'Произошла ошибка на сервере' }));
};

export const findUserById = (req: Request, res: Response): void => {
  User.findById(req.params.userId)
    .then((user) => {
      if (user === null) {
        res.status(STATUS_404).send({ message: 'Пользователь не найден' });
        return;
      }
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res
          .status(STATUS_400)
          .send({ message: 'Некорректный id пользователя' });
        return;
      }
      res.status(STATUS_500).send({ message: 'Неизвестная ошибка' });
    });
};

export const createUser = (req: Request, res: Response): void => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user: IUser) => res.send({ data: user }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({
          message: 'Переданы некорректные данные при создании пользователя',
        });
        return;
      }
      res
        .status(STATUS_500)
        .send({ message: 'Неизвестная ошибка при создании пользователя' });
    });
};

export const updateUserInfo = (req: IRequest, res: Response): void => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { name, about },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      }
      if (user == null) {
        res
          .status(STATUS_404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({
          message: 'Переданы некорректные данные при обновлении профиля',
        });
        return;
      }
      res
        .status(STATUS_500)
        .send({ message: 'Произошла ошибка при создании пользователя' });
    });
};

export const updateUserAvatar = (req: IRequest, res: Response): void => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user?._id,
    { avatar },
    {
      new: true,
      runValidators: true,
      upsert: false,
    },
  )
    .then((user) => {
      if (user !== null) {
        res.send({ data: user });
      }
      if (user == null) {
        res
          .status(STATUS_404)
          .send({ message: 'Пользователь с указанным _id не найден' });
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(STATUS_400).send({
          message: 'Переданы некорректные данные при обновлении аватара',
        });
        return;
      }
      res.status(STATUS_500).send({ message: 'Произошла ошибка' });
    });
};
