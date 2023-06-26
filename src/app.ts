import express, { Request, Response } from 'express';
import mongoose from "mongoose";
import router from './routes/users';

interface IRequest extends Request {
  user?: {
    _id: string
  }
}

const { PORT = 3000 } = process.env;

const app = express();
const connectDb = async (): Promise<any> => {
  await mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
    console.info("Connected to database");
  });
};

connectDb().catch((error) => console.error(error));

app.use((req: IRequest, res: Response, next) => {
  req.user = {
    _id: '64997fddc84db255b0f5319e'
  };

  next();
});

app.use(express.json());
app.use("/", router);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
