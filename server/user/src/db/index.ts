import mongoose from "mongoose";
import {
  MONGODB_LOCAL_URI, consoleLogger
} from "../config"

export const connectDB = async () => {
  mongoose.connect(MONGODB_LOCAL_URI);

  const conn = mongoose.connection;

  conn.on("connected", function () {
    consoleLogger.info("[MONGODB] ", "database is connected successfully");
  });

  conn.on("disconnected", function () {
    consoleLogger.info("[MOGODB] ", "database is disconnected successfully");
  });

  conn.on("error", console.error.bind(console, "connection error:"));
};