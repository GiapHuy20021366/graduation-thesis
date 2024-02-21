import express, { Express } from "express";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {
  app.use("/", userRouter);
};
