import { NextFunction, Request, Response } from 'express';
import Card, { ICard } from '../models/card';
import BadRequestError from '../errors/bad-request-err';
import NotFoundError from '../errors/not-found-err';
import ForbiddenAccessError from '../errors/forbidden-access-err';

interface IRequest extends Request {
  user?: {
    _id: string;
  };
}

export const getAllCards = (req: IRequest, res: Response, next: NextFunction): void => {
  Card.find({})
    .then((card) => res.send({ data: card }))
    .catch(next);
};

export const createCard = (req: IRequest, res: Response, next: NextFunction): void => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user?._id })
    .then((card: ICard) => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(' Переданы некорректные данные при создании карточки'));
      }
      next(err);
    });
};

export const deleteCard = (req: IRequest, res: Response, next: NextFunction): void => {
  const owner = req.user!._id;
  Card.findById(req.params.cardId)
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий id карточки');
    })
    .then((card) => {
      if (String(card.owner) === owner) {
        return card.remove()
          .then(() => res.send({ message: 'Карточка успешно удалена' }));
      }
      throw new ForbiddenAccessError('Карточки других пользователей не могут быть удалены');
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

export const likeCard = (req: IRequest, res: Response, next: NextFunction): void => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user?._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий id карточки');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};

export const dislikeCard = (req: IRequest, res: Response, next: NextFunction): void => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user?._id } },
    { new: true },
  )
    .orFail(() => {
      throw new NotFoundError('Передан несуществующий id карточки');
    })
    .then((card) => {
      res.send({ data: card });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      }
      next(err);
    });
};
