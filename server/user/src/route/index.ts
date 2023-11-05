import express, { Express } from "express";
import { errorHandler, checkRequestBodyAndParams } from "../middlewares";
import { registAccount } from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {

    userRouter.post(
        "/register",
        checkRequestBodyAndParams,
        registAccount
    );
    
    userRouter.use(errorHandler);
    app.use("/", userRouter);
}
