import express, { Express } from "express";
import { errorHandler, tokenParser } from "../middlewares";
import { postFood, uploadImages } from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {
    userRouter.get("/", (_req, res) => {
        return res.send("Hello from food service")
    });

    userRouter.post("/images/upload", tokenParser, uploadImages);

    userRouter.post("/foods/upload", /*tokenParser,*/ postFood);

    userRouter.use(errorHandler);
    app.use("/", userRouter);
}
