import express, { Express } from "express";
import { errorHandler, tokenParser } from "../middlewares";
import {
  findFoodPost,
  getLikedFoodPost,
  likeOrUnlikeFoodPost,
  postFood,
  searchFoodPost,
  searchHistory,
  updateFoodPost,
  uploadImages,
} from "../controllers";

const foodRouter = express.Router();

export const initUserRouters = (app: Express): void => {
  foodRouter.post("/images", tokenParser, uploadImages);

  foodRouter.post("/foods", tokenParser, postFood);
  foodRouter.put("/foods/:id", tokenParser, updateFoodPost);

  foodRouter.post("/foods/search", tokenParser, searchFoodPost);
  foodRouter.post("/foods/search/history", tokenParser, searchHistory);
  foodRouter.get("/foods/:id", tokenParser, findFoodPost);
  foodRouter.put("/foods/:id/like", tokenParser, likeOrUnlikeFoodPost);

  foodRouter.get("/foods/like/users/:userId", tokenParser, getLikedFoodPost);

  foodRouter.use(errorHandler);
  app.use("/", foodRouter);
};
