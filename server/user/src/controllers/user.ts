import { NextFunction, Request, Response } from "express";
import {
  AuthLike,
  FollowRole,
  ICoordinates,
  IFollowerSearchParams,
  IPagination,
  IPersonalDataUpdate,
  IUserSearchParams,
  InvalidDataError,
  Paginationed,
  UnauthorizationError,
  isCoordinates,
  isLocation,
  isNumber,
  isObjectId,
  toFollowerSearchParams,
  toPersonalDataUpdate,
  toResponseSuccessData,
  toUserSearchParams,
} from "../data";
import {
  searchUsersAround as searchUsersAroundService,
  getBasicUserInfo as getBasicUserInfoService,
  searchUser as searchUserService,
  followUser as followUserService,
  unFollowUser as unFollowUserService,
  updateUserPersonal as updateUserPersonalService,
  getUser as getUserService,
  getFollowers,
} from "../services";

interface ISearchUsersAroundParams extends Paginationed {
  currentLocation?: ICoordinates;
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

export const followUser = async (
  req: Request<{ id: string }, {}, {}, { action?: "follow" | "unfollow" }>,
  res: Response,
  next: NextFunction
) => {
  const targetUser = req.params.id;
  if (!isObjectId(targetUser)) {
    return next(new InvalidDataError());
  }
  const auth = req.authContext as AuthLike;
  const sourceUser = auth._id;
  const action = req.query.action;
  const service = action === "follow" ? followUserService : unFollowUserService;
  service(targetUser, sourceUser)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getUser = async (
  req: Request<{ id: string }, {}, {}, { detail?: string }>,
  res: Response,
  next: NextFunction
) => {
  const targetUser = req.params.id;
  if (!isObjectId(targetUser)) {
    return next(new InvalidDataError());
  }
  const auth = req.authContext as AuthLike;
  const sourceUser = auth._id;
  const detail = req.query.detail === "true";
  getUserService(targetUser, sourceUser, detail)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const updateUserPersonal = async (
  req: Request<{ id: string }, {}, IPersonalDataUpdate, {}>,
  res: Response,
  next: NextFunction
) => {
  const targetUser = req.params.id;
  if (!isObjectId(targetUser)) {
    return next(new InvalidDataError());
  }
  const auth = req.authContext as AuthLike;
  const sourceUser = auth._id;
  if (targetUser !== sourceUser) {
    return next(new UnauthorizationError());
  }
  const params = req.body;
  const updateParams = toPersonalDataUpdate(params);
  updateUserPersonalService(targetUser, updateParams)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getUsersAndPlacesFollowed = async (
  req: Request<{ id: string }, {}, IFollowerSearchParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const targetUser = req.params.id;
  if (!isObjectId(targetUser)) {
    return next(new InvalidDataError());
  }
  const params = req.body;
  const searchParams: IFollowerSearchParams = {
    ...toFollowerSearchParams(params),
    subcriber: {
      include: targetUser,
    },
  };
  getFollowers(searchParams)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getUserFollowers = async (
  req: Request<{ id: string }, {}, IFollowerSearchParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const targetUser = req.params.id;
  if (!isObjectId(targetUser)) {
    return next(new InvalidDataError());
  }
  const params = req.body;
  const searchParams: IFollowerSearchParams = {
    ...toFollowerSearchParams(params),
    role: [FollowRole.USER],
    user: {
      include: targetUser,
    },
  };
  getFollowers(searchParams)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};
