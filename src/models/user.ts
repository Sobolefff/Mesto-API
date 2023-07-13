import mongoose, { Model, Document } from 'mongoose';
import { linkRegex } from '../utils/constants';
import UnauthorizedError from '../errors/unauthorized-err';

const bcrypt = require('bcrypt');
const isEmailValidator = require('validator').isEmail;

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  // eslint-disable-next-line no-unused-vars
  findUserByCredentials: (email: string, password: string) => Promise<Document<unknown, any, IUser>>
}

const userSchema = new mongoose.Schema<IUser, UserModel>(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      required: true,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
      validate: {
        validator(value: string) {
          return linkRegex.test(value);
        },
        message: 'Невалидный URL',
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => isEmailValidator(v),
        message: 'Неправильный формат почты',
      },
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
  },
);

userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password').then((user: any) => {
    if (!user) {
      throw new UnauthorizedError('Передан неккоректный пароль');
    }
    return bcrypt.compare(password, user.password).then((matched: any) => {
      if (!matched) {
        throw new UnauthorizedError('Передан неккоректный пароль');
      }
      return user;
    });
  });
});

export default mongoose.model<IUser, UserModel>('user', userSchema);
