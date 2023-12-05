import express, { Express } from "express";
import { errorHandler } from "../middlewares";
// import { } from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {
    userRouter.use(errorHandler);
    app.get("/", (req, res) => {
        return res.send("Hello from food service")
    })
    app.use("/", userRouter);
}
