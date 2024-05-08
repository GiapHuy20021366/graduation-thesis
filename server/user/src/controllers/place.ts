import { NextFunction, Request, Response } from "express";
import {
  createNewPlace as createPlaceService,
  updatePlace as updatePlaceService,
  activePlace as activePlaceService,
  followPlace as followPlaceService,
  unfollowPlace as unfollowPlaceService,
  searchPlaces as searchPlacesService,
  ratingPlace as ratingPlaceService,
  getPlaceInfo as getPlaceInfoService,
  getPlacesByUserFollow as getPlacesByUserFollowService,
  getPlacesRankByFavorite,
  getPlacesRatedByUser,
  getFollowers,
} from "../services";
import {
  AuthLike,
  FollowRole,
  FollowType,
  IFollowerSearchParams,
  IPagination,
  IPlaceData,
  IPlaceSearchParams,
  InvalidDataError,
  Paginationed,
  PlaceType,
  isAllNotEmptyString,
  isArrayFollowTypes,
  isArrayPlaceTypes,
  isLocation,
  isNotEmptyString,
  isObjectId,
  isPagination,
  isString,
  throwErrorIfInvalidFormat,
  toFollowerSearchParams,
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
  throwErrorIfInvalidFormat("expose-name", value.exposedName, isNotEmptyString);
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

interface IGetPlacesParams extends Paginationed {
  followTypes?: FollowType[];
  placeTypes?: PlaceType[];
}

export const getPlacesByUserFollow = async (
  req: Request<{ userId?: string }, {}, IGetPlacesParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const { followTypes, pagination, placeTypes } = req.body;
  const user = req.params.userId;

  if (!isObjectId(user)) {
    return next(
      new InvalidDataError({
        message: "Invalid user id",
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }

  const params = {
    followTypes: isArrayFollowTypes(followTypes) ? followTypes : undefined,
    user: user,
    placeTypes: isArrayPlaceTypes(placeTypes) ? placeTypes : undefined,
    pagination: isPagination(pagination)
      ? pagination
      : {
          skip: 0,
          limit: 24,
        },
  };

  getPlacesByUserFollowService(
    params.user,
    params.followTypes,
    params.placeTypes,
    params.pagination
  )
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getRankFavoritePlaces = async (
  req: Request<{}, {}, {}, { skip?: string; limit?: string }>,
  res: Response,
  next: NextFunction
) => {
  const { skip, limit } = req.query;
  const pagination: IPagination = {
    skip: skip && !isNaN(+skip) ? +skip : 0,
    limit: limit && !isNaN(+limit) ? +limit : 0,
  };
  getPlacesRankByFavorite(pagination)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getRatedPlaces = async (
  req: Request<{ userId?: string }, {}, {}, { skip?: string; limit?: string }>,
  res: Response,
  next: NextFunction
) => {
  const userId = req.params.userId;
  if (!isObjectId(userId)) {
    return next(
      new InvalidDataError({
        message: "Invalid userId",
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }

  const { skip, limit } = req.query;
  const pagination: IPagination = {
    skip: skip && !isNaN(+skip) ? +skip : 0,
    limit: limit && !isNaN(+limit) ? +limit : 0,
  };

  getPlacesRatedByUser(userId, pagination)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getPlaceFollowers = async (
  req: Request<{ id: string }, {}, IFollowerSearchParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const targetPlace = req.params.id;
  if (!isObjectId(targetPlace)) {
    return next(new InvalidDataError());
  }
  const params = req.body;
  const searchParams: IFollowerSearchParams = {
    ...toFollowerSearchParams(params),
    role: [FollowRole.PLACE],
    place: {
      include: targetPlace,
    },
  };
  getFollowers(searchParams)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};
