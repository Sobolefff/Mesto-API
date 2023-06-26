import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      minlength: 2,
      maxlength: 30,
      default: "Spider-Man",
      required: true,
    },
    about: {
      type: String,
      minlength: 2,
      maxlength: 200,
      default: "Friendly Neighborhood",
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
  },
  { versionKey: false }
);

export default mongoose.model("user", userSchema);
