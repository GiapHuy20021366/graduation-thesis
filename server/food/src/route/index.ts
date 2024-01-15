import express, { Express } from "express";
import { errorHandler, tokenParser } from "../middlewares";
import {
  findFoodPost,
  postFood,
  searchFoodPost,
  searchHistory,
  uploadImages,
} from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {
  userRouter.get("/", (_req, res) => {
    return res.send("Hello from food service");
  });

  userRouter.post("/images/upload", tokenParser, uploadImages);

  userRouter.post("/foods/upload", tokenParser, postFood);
  userRouter.post("/foods/search", tokenParser, searchFoodPost);
  userRouter.post("/foods/search/history", tokenParser, searchHistory);
  userRouter.get("/foods/:id", tokenParser, findFoodPost);

  userRouter.use(errorHandler);
  app.use("/", userRouter);
};
