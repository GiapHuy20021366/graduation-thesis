import { NextFunction, Request, Response } from "express";
import {
  AuthLike,
  ILocation,
  InvalidDataError,
  UnauthorizationError,
  isLocation,
  toResponseSuccessData,
} from "../data";
import { setUserLocation as setUserLocationService } from "../services";

type ISetLocationBody = ILocation;

export const setUserLocation = async (
  req: Request<{ id: string }, {}, ISetLocationBody, {}>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const id = auth._id;
  if (id !== auth._id) {
    return next(
      new UnauthorizationError({
        message: "Permition deny",
        data: {
          target: "permition",
          reason: "invalid-permition",
        },
      })
    );
  }
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

  setUserLocationService(auth._id, location).then(() =>
    res.status(200).json(toResponseSuccessData({}))
  );
};
