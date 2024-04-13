import express, { Express } from "express";
import { errorHandler, tokenParser } from "../middlewares";
import {
  activeFood,
  findFoodPost,
  getLikedFoodPost,
  likeOrUnlikeFoodPost,
  postFood,
  resolveFood,
  searchFoodPost,
  searchHistory,
  updateFoodPost,
  uploadImages,
} from "../controllers";
import { getFavoriteFoods, getRegisteredFoods } from "../controllers";

const router = express.Router();

export const initRouter = (app: Express): void => {
  router.post("/images", tokenParser, uploadImages);

  router.post("/", tokenParser, postFood);
  router.put("/:id", tokenParser, updateFoodPost);

  router.post("/search", tokenParser, searchFoodPost);
  router.post("/search/history", tokenParser, searchHistory);
  router.get("/:id", tokenParser, findFoodPost);
  router.put("/:id/like", tokenParser, likeOrUnlikeFoodPost);

  router.get("/like/users/:userId", tokenParser, getLikedFoodPost);

  router.get("/register/users/:id", tokenParser, getRegisteredFoods);
  router.get("/favorite/users/:id", tokenParser, getFavoriteFoods);
  router.put("/:id/resolve", tokenParser, resolveFood);
  router.put("/:id/active", tokenParser, activeFood);

  router.use(errorHandler);
  app.use("/foods/", router);
};
