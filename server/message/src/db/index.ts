import mongoose from "mongoose";
import {
    MONGODB_LOCAL_URI
} from "../config"

export const connectDB = async () => {
  mongoose.connect(MONGODB_LOCAL_URI, {});

  const conn = mongoose.connection;
  conn.on("connected", function () {
    console.log("database is connected successfully");
  });
  conn.on("disconnected", function () {
    console.log("database is disconnected successfully");
  });
  conn.on("error", console.error.bind(console, "connection error:"));
};