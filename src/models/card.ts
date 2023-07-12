import mongoose from 'mongoose';
import { linkRegex } from '../utils/constants';

export interface ICard {
  name: string;
  link: string;
  owner: mongoose.Schema.Types.ObjectId;
  likes: mongoose.Schema.Types.ObjectId[];
  createdAt: Date;
}

const cardSchema = new mongoose.Schema<ICard>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  likes: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'user' }],
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

cardSchema.path('link').validate((val) => {
  const urlRegex = linkRegex;
  return urlRegex.test(val);
}, 'Некорректный URL.');

export default mongoose.model<ICard>('card', cardSchema);
