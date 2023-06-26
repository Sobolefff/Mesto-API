import { Request, Response } from 'express';
import User from '../models/user';
import { STATUS_400, STATUS_404, STATUS_500 } from '../utils/constants';

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
    .then((user) => res.send({ data: user }))
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
