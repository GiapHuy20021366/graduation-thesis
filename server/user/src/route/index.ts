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
} from "../controllers";

const userRouter = express.Router();

export const initUserRouters = (app: Express): void => {
  userRouter.post("/register", checkRegistBodyAndParams, registAccount);

  userRouter.post("/login", checkLoginBodyAndParams, loginAccount);

  userRouter.get("/active", activeManualAccount);

  userRouter.get("/token/refresh", tokenParser, refreshToken);

  userRouter.put("/location", tokenParser, setUserLocation);

  userRouter.post("/search/location", tokenParser, searchUsersAround);

  userRouter.get("/info/:id", tokenParser, getBasicUserInfo);

  userRouter.post("/places", tokenParser, createNewPlace);
  userRouter.put("/places/:id", tokenParser, updatePlace);
  userRouter.get("/places/:id/active", tokenParser, activePlace);
  userRouter.get("/places/:id/follow", tokenParser, followPlace);
  userRouter.post("/places/search", tokenParser, searchPlaces);
  userRouter.get("/places/:id/rating", tokenParser, searchPlaces);
  userRouter.get("/places/:id", tokenParser, getPlaceInfo);

  userRouter.use(errorHandler);
  app.use("/", userRouter);
};
