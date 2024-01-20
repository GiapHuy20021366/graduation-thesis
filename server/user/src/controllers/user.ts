import { NextFunction, Request, Response } from "express";
import {
  ICoordinates,
  IPagination,
  InvalidDataError,
  isCoordinates,
  isLocation,
  isNumber,
  toResponseSuccessData,
} from "../data";
import { searchUsersAround as searchUsersAroundService } from "../services";

interface ISearchUsersAroundParams {
  currentLocation?: ICoordinates;
  pagination?: IPagination;
  maxDistance?: number;
}

export const searchUsersAround = async (
  req: Request<{}, {}, ISearchUsersAroundParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const { currentLocation, maxDistance, pagination } = req.body;
  if (!isCoordinates(currentLocation)) {
    return next(
      new InvalidDataError({
        message: "No-current-location-found",
        data: {
          target: "location",
          reason: "no-coordinates-found",
        },
      })
    );
  }
  if (!isNumber(maxDistance)) {
    return next(
      new InvalidDataError({
        message: "No max distance found",
        data: {
          target: "max-distance",
          reason: "no-max-distance-found",
        },
      })
    );
  }

  const paginationParam: IPagination = isLocation(pagination)
    ? pagination!
    : { skip: 0, limit: 50 };

  searchUsersAroundService({
    location: currentLocation!,
    maxDistance: maxDistance!,
    pagination: paginationParam,
  }).then((data) => res.status(200).json(toResponseSuccessData(data)));
};
