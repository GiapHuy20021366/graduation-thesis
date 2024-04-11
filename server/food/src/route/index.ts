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
import { getFavoriteFoods, getRegisteredFoods } from "../controllers";

const foodRouter = express.Router();

export const initUserRouters = (app: Express): void => {
  foodRouter.post("/images", tokenParser, uploadImages);

  foodRouter.post("/", tokenParser, postFood);
  foodRouter.put("/:id", tokenParser, updateFoodPost);

  foodRouter.post("/search", tokenParser, searchFoodPost);
  foodRouter.post("/search/history", tokenParser, searchHistory);
  foodRouter.get("/:id", tokenParser, findFoodPost);
  foodRouter.put("/:id/like", tokenParser, likeOrUnlikeFoodPost);

  foodRouter.get("/like/users/:userId", tokenParser, getLikedFoodPost);

  foodRouter.get("/register/users/:id", tokenParser, getRegisteredFoods);
  foodRouter.get("/favorite/users/:id", tokenParser, getFavoriteFoods);

  foodRouter.use(errorHandler);
  app.use("/foods/", foodRouter);
};
