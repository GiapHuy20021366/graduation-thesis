import express, { Express } from "express";
import { errorHandler, tokenParser } from "../middlewares";
import {
  findFoodPost,
  likeOrUnlikeFoodPost,
  postFood,
  searchFoodPost,
  searchHistory,
  uploadImages,
} from "../controllers";

const foodRouter = express.Router();

export const initUserRouters = (app: Express): void => {
  foodRouter.get("/", (_req, res) => {
    return res.send("Hello from food service");
  });

  foodRouter.post("/images/upload", tokenParser, uploadImages);

  foodRouter.post("/foods/upload", tokenParser, postFood);
  foodRouter.post("/foods/search", tokenParser, searchFoodPost);
  foodRouter.post("/foods/search/history", tokenParser, searchHistory);
  foodRouter.get("/foods/:id", tokenParser, findFoodPost);
  foodRouter.put("/foods/like/:id", tokenParser, likeOrUnlikeFoodPost);

  foodRouter.use(errorHandler);
  app.use("/", foodRouter);
};
