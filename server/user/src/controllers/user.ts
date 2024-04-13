import { NextFunction, Request, Response } from "express";
import {
  AuthLike,
  FollowRole,
  IFollowerSearchParams,
  IPersonalDataUpdate,
  IUserSearchParams,
  InvalidDataError,
  UnauthorizationError,
  isObjectId,
  toFollowerSearchParams,
  toPersonalDataUpdate,
  toResponseSuccessData,
  toUserSearchParams,
} from "../data";
import {
  searchUser as searchUserService,
  followUser as followUserService,
  unFollowUser as unFollowUserService,
  updateUserPersonal as updateUserPersonalService,
  getUser as getUserService,
  getFollowers,
} from "../services";

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
