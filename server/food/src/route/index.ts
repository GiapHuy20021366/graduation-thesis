import express, { Express } from "express";
import { errorHandler } from "../middlewares";
import { } from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {
    userRouter.use(errorHandler);
    app.use("/", userRouter);
}
