import express, { Express } from "express";
import { errorHandler } from "../middlewares";
import { registAccount } from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {

    userRouter.post("/regist", registAccount);
    
    userRouter.use(errorHandler)
    app.use("/", userRouter);
}
