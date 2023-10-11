import { Schema } from "mongoose";

const user = new Schema({
  username: {
    type: String,
    index: true,
    unique: true,
  },
  password: String,
  email: {
    type: String,
    index: true,
    unique: true,
  },
  avatar: String,
  createAt: { type: Date, default: Date.now },
});

export default user;