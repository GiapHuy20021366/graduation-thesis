import express, { Express } from "express";
import {
    errorHandler,
    checkRegistBodyAndParams,
    checkLoginBodyAndParams,
    tokenParser
} from "../middlewares";
import {
    registAccount,
    activeManualAccount,
    loginAccount,
    refreshToken
} from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {

    userRouter.post(
        "/register",
        checkRegistBodyAndParams,
        registAccount
    );

    userRouter.post(
        "/login",
        checkLoginBodyAndParams,
        loginAccount
    );

    userRouter.get(
        "/active",
        activeManualAccount
    )

    userRouter.get(
        "/token/refresh",
        tokenParser,
        refreshToken
    )

    userRouter.use(errorHandler);
    app.use("/", userRouter);
}
