import express, { Express } from "express";
import {
  errorHandler,
  checkRegistBodyAndParams,
  checkLoginBodyAndParams,
  tokenParser,
} from "../middlewares";
import {
  registAccount,
  activeManualAccount,
  loginAccount,
  refreshToken,
  setUserLocation,
  searchUsersAround,
  getBasicUserInfo,
  createNewPlace,
  updatePlace,
  activePlace,
  followPlace,
  searchPlaces,
  getPlaceInfo,
  getPlacesByUserFollow,
} from "../controllers";

const initUserRouter = (app: Express) => {
  const userRouter = express.Router();

  // Register an user account
  userRouter.post("/register", checkRegistBodyAndParams, registAccount);

  // Login an user
  userRouter.post("/login", checkLoginBodyAndParams, loginAccount);

  // Active user account
  userRouter.get("/active", activeManualAccount);

  // Refresh token session
  userRouter.get("/token/refresh", tokenParser, refreshToken);

  // Set user location
  userRouter.put("/:id/location", tokenParser, setUserLocation);

  // Get information of an user
  userRouter.get("/:id", tokenParser, getBasicUserInfo);

  // Find users around a position
  userRouter.post("/around", tokenParser, searchUsersAround);

  userRouter.use(errorHandler);
  app.use("/users", userRouter);
};

const initPlaceRouter = (app: Express) => {
  const placeRouter = express.Router();

  // Create a new place
  placeRouter.post("/register", tokenParser, createNewPlace);

  // Update information of a place
  placeRouter.put("/:id", tokenParser, updatePlace);

  // Active a place
  placeRouter.get("/:id/active", tokenParser, activePlace);

  // Follow a place
  placeRouter.get("/:id/follow", tokenParser, followPlace);

  // Search places by information
  placeRouter.post("/search", tokenParser, searchPlaces);

  // Rating a place
  placeRouter.get("/:id/rating", tokenParser, searchPlaces);

  // Get information of a place
  placeRouter.get("/:id", tokenParser, getPlaceInfo);

  // Get places by follow util
  placeRouter.post("/follow/search", tokenParser, getPlacesByUserFollow);

  placeRouter.use(errorHandler);
  app.use("/places", placeRouter);
};

export const initRouters = (app: Express): void => {
  initUserRouter(app);
  initPlaceRouter(app);
};
