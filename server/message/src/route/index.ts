import express, { Express } from "express";
import { hello } from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {

    
    userRouter.get("/", hello);
    app.use("/", userRouter);
}
