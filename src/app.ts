import express from "express";
import mongoose from "mongoose";

const { PORT = 3000 } = process.env;

const app = express();
const connectDb = async (): Promise<any> => {
  await mongoose.connect("mongodb://localhost:27017/mestodb").then(() => {
    console.info("Connected to database");
  });
};

connectDb().catch((error) => console.error(error));

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
