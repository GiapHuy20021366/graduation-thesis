import { NextFunction, Request, Response } from "express";
import {
  IPlaceData,
  createNewPlace as createPlaceService,
  updatePlace as updatePlaceService,
  activePlace as activePlaceService,
  followPlace as followPlaceService,
  unfollowPlace as unfollowPlaceService,
  searchPlaces as searchPlacesService,
  ratingPlace as ratingPlaceService,
  getPlaceInfo as getPlaceInfoService,
} from "../services";
import {
  AuthLike,
  FollowType,
  IPagination,
  IPlaceSearchParams,
  InvalidDataError,
  isAllNotEmptyString,
  isLocation,
  isNotEmptyString,
  isObjectId,
  isString,
  throwErrorIfInvalidFormat,
  toPlace,
  toPlaceSearchParams,
  toResponseSuccessData,
} from "../data";

const validatePlaceData = (value?: IPlaceData) => {
  if (value == null) {
    throw new InvalidDataError({
      message: "Invalid place data",
    });
  }
  throwErrorIfInvalidFormat("expose-name", value.exposeName, isNotEmptyString);
  throwErrorIfInvalidFormat("description", value.description, isString);
  throwErrorIfInvalidFormat(
    "categories",
    value.categories,
    isAllNotEmptyString
  );
  throwErrorIfInvalidFormat("location", value.location, isLocation);
};

export const createNewPlace = async (
  req: Request<{}, {}, IPlaceData, {}>,
  res: Response,
  next: NextFunction
) => {
  try {
    validatePlaceData(req.body);
  } catch (error) {
    return next(error);
  }

  const dataToCreate = toPlace(req.body);
  if (dataToCreate == null) {
    return next(
      new InvalidDataError({
        message: "Data invalid",
        data: {
          target: "data",
          reason: "invalid",
        },
      })
    );
  }

  const auth = req.authContext as AuthLike;

  createPlaceService(dataToCreate, auth._id)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const updatePlace = async (
  req: Request<{ id?: string }, {}, IPlaceData, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid id ${id}`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }
  try {
    validatePlaceData(req.body);
  } catch (error) {
    return next(error);
  }

  const dataToCreate = toPlace(req.body);
  if (dataToCreate == null) {
    return next(
      new InvalidDataError({
        message: "Data invalid",
        data: {
          target: "data",
          reason: "invalid",
        },
      })
    );
  }

  const auth = req.authContext as AuthLike;

  updatePlaceService(dataToCreate, id, auth._id)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const activePlace = async (
  req: Request<{ id?: string }, {}, {}, { active?: "true" | "false" }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid id ${id}`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }
  const active = req.query.active === "true";
  const auth = req.authContext as AuthLike;

  activePlaceService(id, auth._id, active)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const followPlace = async (
  req: Request<
    { id?: string },
    {},
    {},
    { type?: string; action?: "follow" | "unfollow" }
  >,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid id ${id}`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }
  const type = +(req.query.type || "");
  const followType =
    type && Object.values(FollowType).includes(type)
      ? type
      : FollowType.SUBCRIBER;
  const isFollow = req.query.action !== "unfollow";

  const auth = req.authContext as AuthLike;

  if (isFollow) {
    followPlaceService(id, auth._id, followType)
      .then((data) => res.status(200).json(toResponseSuccessData(data)))
      .catch(next);
  } else {
    unfollowPlaceService(id, auth._id)
      .then((data) => res.status(200).json(toResponseSuccessData(data)))
      .catch(next);
  }
};

export const searchPlaces = async (
  req: Request<{}, {}, IPlaceSearchParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const params = toPlaceSearchParams(req.body);
  if (params == null) {
    return next(
      new InvalidDataError({
        message: "Invalid data",
        data: {
          reason: "invalid",
          target: "data",
        },
      })
    );
  }

  searchPlacesService(params)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const ratingPlace = async (
  req: Request<{ id?: string }, {}, {}, { score?: string }>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid id ${id}`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }

  const score = +(req.query.score ?? "");
  const auth = req.authContext as AuthLike;

  ratingPlaceService(id, auth._id, score)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getPlaceInfo = async (
  req: Request<{ id?: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid id ${id}`,
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }
  const auth = req.authContext as AuthLike;

  getPlaceInfoService(id, auth._id)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

interface IGetPlacesParams {
  followTypes?: FollowType[];
  pagination?: IPagination;
  user?: string;
}

export const getPlacesByUserAndFollowTypes = async (
  req: Request<{}, {}, IGetPlacesParams, {}>,
  res: Response,
  next: NextFunction
) => {

};
