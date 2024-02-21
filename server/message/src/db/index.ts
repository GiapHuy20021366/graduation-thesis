import mongoose from "mongoose";
import {
    MONGODB_LOCAL_URI, consoleLogger
} from "../config"

export const connectDB = async () => {
  mongoose.connect(MONGODB_LOCAL_URI);

  const conn = mongoose.connection;
  conn.on("connected", function () {
    consoleLogger.info("database is connected successfully");
  });
  conn.on("disconnected", function () {
    consoleLogger.info("database is disconnected successfully");
  });
  conn.on("error", (error) => consoleLogger.err(error));
};