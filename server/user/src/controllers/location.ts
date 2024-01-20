import { NextFunction, Request, Response } from "express";
import {
  AuthLike,
  ILocation,
  InvalidDataError,
  isLocation,
  toResponseSuccessData,
} from "../data";
import { setUserLocation as setUserLocationService } from "../services";

type ISetLocationBody = ILocation;

export const setUserLocation = async (
  req: Request<{}, {}, ISetLocationBody, {}>,
  res: Response,
  next: NextFunction
) => {
  const location = req.body;
  if (!isLocation(location)) {
    return next(
      new InvalidDataError({
        message: "Location invalid",
        data: {
          target: "location",
          reason: "invalid-location",
        },
      })
    );
  }
  const auth = req.authContext as AuthLike;

  setUserLocationService(auth._id, location).then(() =>
    res.status(200).json(toResponseSuccessData({}))
  );
};
