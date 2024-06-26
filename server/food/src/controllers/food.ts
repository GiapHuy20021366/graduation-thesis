import { NextFunction, Request, Response } from "express";
import {
  AuthLike,
  IFoodPost,
  IFoodSearchParams,
  IPagination,
  IPostFoodData,
  InvalidDataError,
  isAllNotEmptyString,
  isLocation,
  isNotEmptyArray,
  isNotEmptyString,
  isNumber,
  isObjectId,
  throwErrorIfInvalidFormat,
  throwErrorIfNotFound,
  toFoodSearchParams,
  toResponseSuccessData,
} from "../data";
import * as services from "../services";

interface IPostFoodUploadData
  extends Omit<Partial<IFoodPost>, "place" | "user"> {
  place?: string;
}

interface IPostFoodExtend extends IPostFoodUploadData {
  user?: string;
}

const validatePostFoodBody = (data: IPostFoodExtend): data is IPostFoodData => {
  const {
    images,
    categories,
    description,
    duration,
    location,
    quantity,
    title,
    price,
    place,
    user,
  } = data;

  throwErrorIfNotFound("user", user);
  throwErrorIfNotFound("images", images);
  throwErrorIfNotFound("title", title);
  throwErrorIfNotFound("location", location);
  throwErrorIfNotFound("categories", categories);
  throwErrorIfNotFound("description", description);
  throwErrorIfNotFound("duration", duration);
  throwErrorIfNotFound("quantity", quantity);
  throwErrorIfNotFound("price", price);

  // check data format
  throwErrorIfInvalidFormat("user", user, [isObjectId]);
  if (place != null) {
    throwErrorIfInvalidFormat("place", place, [isObjectId]);
  }
  throwErrorIfInvalidFormat("title", title, [isNotEmptyString]);
  throwErrorIfInvalidFormat("images", images, [
    isNotEmptyArray,
    isAllNotEmptyString,
  ]);
  throwErrorIfInvalidFormat("categories", categories, [isAllNotEmptyString]);
  throwErrorIfInvalidFormat("duration", duration, [isNumber]);
  throwErrorIfInvalidFormat("location", location, [isLocation]);
  throwErrorIfInvalidFormat("quantity", quantity, [isNumber]);
  throwErrorIfInvalidFormat("price", price, [isNumber]);

  return true;
};

export const postFood = async (
  req: Request<{}, {}, IPostFoodUploadData, {}>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const valData: IPostFoodExtend = {
    ...req.body,
    user: auth._id,
  };
  try {
    if (validatePostFoodBody(valData)) {
      services
        .postFood(valData)
        .then((data) => res.status(200).json(toResponseSuccessData(data)))
        .catch(next);
    }
  } catch (error) {
    return next(error);
  }
};

export const updateFoodPost = async (
  req: Request<{ id: string }, {}, IPostFoodUploadData, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;
  const auth = req.authContext as AuthLike;

  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid _id: ${id}`,
        data: {
          target: "_id",
          reason: "invalid",
        },
      })
    );
  }

  const valData: IPostFoodExtend = {
    ...req.body,
    user: auth._id,
  };
  try {
    if (validatePostFoodBody(valData)) {
      services
        .updateFoodPost(id, valData)
        .then((data) => res.status(200).json(toResponseSuccessData(data)))
        .catch(next);
    }
  } catch (error) {
    return next(error);
  }
};

export const findFoodPost = async (
  req: Request<{ id?: string }, {}, {}, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = req.params.id;

  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: "Invalid id format",
        data: {
          target: "id",
          reason: "invalid",
        },
      })
    );
  }

  const auth = req.authContext as AuthLike;

  services
    .findFoodPostById(id, auth._id)
    .then((data) => res.status(200).send(toResponseSuccessData(data)))
    .catch(next);
};

export const searchFoodPost = async (
  req: Request<{}, {}, IFoodSearchParams, {}>,
  res: Response,
  next: NextFunction
) => {
  const params = req.body;
  const auth = req.authContext as AuthLike;
  const paramsToSearch = toFoodSearchParams(params);
  services
    .searchFood(paramsToSearch)
    .then((data) => {
      res.status(200).json(toResponseSuccessData(data));

      // Save the history
      services.saveSearchHistory(auth._id, paramsToSearch);
    })
    .catch(next);
};

export const likeOrUnlikeFoodPost = (
  req: Request<{ id?: string }, {}, {}, { action?: string }>,
  res: Response,
  next: NextFunction
) => {
  const foodId = req.params.id;
  if (!isObjectId(foodId)) {
    return next(
      new InvalidDataError({
        message: `Invalid data foodId: ${foodId}`,
        data: {
          reason: "invalid-food-id",
          target: "food-id",
        },
      })
    );
  }
  const action = req.query.action ?? "LIKE";
  const auth = req.authContext as AuthLike;
  services
    .userLikeOrUnlikeFoodPost(auth._id, foodId!, action === "LIKE")
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const getLikedFoodPost = (
  req: Request<
    { userId?: string },
    {},
    {},
    { user?: string; skip?: string; limit?: string }
  >,
  res: Response,
  next: NextFunction
) => {
  const { skip, limit } = req.query;
  const user = req.params.userId;
  if (!isObjectId(user)) {
    return next(
      new InvalidDataError({
        message: "Invalid user",
        data: {
          reason: "invalid",
          target: "user",
        },
      })
    );
  }

  const _skip = +(skip ?? "");
  const _limit = +(limit ?? "");
  const pagination: IPagination = {
    skip: isNaN(_skip) ? 0 : _skip,
    limit: isNaN(_limit) ? 0 : _limit,
  };

  services
    .getLikedFoods(user, pagination)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const resolveFood = (
  req: Request<{ id: string }, {}, {}, { resolveBy?: string }>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const foodId = req.params.id;
  if (!isObjectId(foodId)) {
    return next(new InvalidDataError());
  }
  const resolveBy = req.query.resolveBy ?? null;
  services
    .resolveFood(auth._id, foodId, resolveBy)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};

export const activeFood = (
  req: Request<{ id: string }, {}, {}, { active?: string }>,
  res: Response,
  next: NextFunction
) => {
  const auth = req.authContext as AuthLike;
  const foodId = req.params.id;
  if (!isObjectId(foodId)) {
    return next(new InvalidDataError());
  }
  const active = req.query.active === "false" ? false : true;
  services
    .activeFood(auth._id, foodId, active)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};
