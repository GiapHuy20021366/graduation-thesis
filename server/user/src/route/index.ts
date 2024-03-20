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
  searchUsersAround,
  createNewPlace,
  updatePlace,
  activePlace,
  followPlace,
  searchPlaces,
  getPlaceInfo,
  getPlacesByUserFollow,
  getRankFavoritePlaces,
  getRatedPlaces,
  ratingPlace,
  getPlaceFollowers,
  searchUser,
  followUser,
  getUser,
  updateUserPersonal,
  getUserFollowers,
  getUsersAndPlacesFollowed,
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

  // Get information of an user
  userRouter.get("/:id", tokenParser, getUser);

  // Search user
  userRouter.post("/search", tokenParser, searchUser);

  // Find users around a position
  userRouter.post("/around", tokenParser, searchUsersAround);

  // Follow / Unfollow user
  userRouter.put("/:id/follow", tokenParser, followUser);

  // Update information data of user
  userRouter.put("/:id", tokenParser, updateUserPersonal);

  // Get places or users that an user followed
  userRouter.post("/:id/follow/search", tokenParser, getUsersAndPlacesFollowed);

  // Get subcribers of an user
  userRouter.post("/:id/subcribe/search", tokenParser, getUserFollowers);

  userRouter.use(errorHandler);
  app.use("/users", userRouter);
};

const initPlaceRouter = (app: Express) => {
  const placeRouter = express.Router();

  // Create a new place
  placeRouter.post("/", tokenParser, createNewPlace);

  // Update information of a place
  placeRouter.put("/:id", tokenParser, updatePlace);

  // Active a place
  placeRouter.get("/:id/active", tokenParser, activePlace);

  // Follow a place
  placeRouter.get("/:id/follow", tokenParser, followPlace);

  // Search places by information
  placeRouter.post("/search", tokenParser, searchPlaces);

  // Rating a place
  placeRouter.get("/:id/rating", tokenParser, ratingPlace);

  // Get information of a place
  placeRouter.get("/:id", tokenParser, getPlaceInfo);

  // Get places by follow util
  placeRouter.post("/follow/users/:userId", tokenParser, getPlacesByUserFollow);

  // Get rank favorite place
  placeRouter.get("/rank/favorite", tokenParser, getRankFavoritePlaces);

  // Get place rated by an user
  placeRouter.get("/rating/users/:userId", tokenParser, getRatedPlaces);

  // Get subcribers of an place
  placeRouter.post("/:id/subcribe/search", tokenParser, getPlaceFollowers);

  placeRouter.use(errorHandler);
  app.use("/places", placeRouter);
};

export const initRouters = (app: Express): void => {
  initUserRouter(app);
  initPlaceRouter(app);
};
