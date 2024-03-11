import { NextFunction, Request, Response } from "express";
import {
  ICoordinates,
  IPagination,
  IUserSearchParams,
  InvalidDataError,
  isCoordinates,
  isLocation,
  isNumber,
  isObjectId,
  toResponseSuccessData,
  toUserSearchParams,
} from "../data";
import {
  searchUsersAround as searchUsersAroundService,
  getBasicUserInfo as getBasicUserInfoService,
  searchUser as searchUserService,
} from "../services";

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
  })
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getBasicUserInfo = (
  req: Request<{ id?: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid id found: ${id}`,
      })
    );
  }
  getBasicUserInfoService(id!)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const searchUser = async (
  req: Request<{}, {}, IUserSearchParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const params = req.body;
  const paramsToSearch = toUserSearchParams(params);
  searchUserService(paramsToSearch)
    .then((data) => res.send(toResponseSuccessData(data)))
    .catch(next);
};

// follow user

// unfollow user

// get exposed user

// update information of user

// get exposed follower with new
