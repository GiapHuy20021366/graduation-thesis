import { NextFunction, Request, Response } from "express";
import {
  AuthLike,
  IFoodSearchParams,
  IPagination,
  InvalidDataError,
  isAllNotEmptyString,
  isLocation,
  isNotEmptyString,
  isNumber,
  isObjectId,
  throwErrorIfInvalidFormat,
  throwErrorIfNotFound,
  toFoodSearchParams,
  toResponseSuccessData,
} from "../data";
import {
  postFood as postFoodService,
  findFoodPostById,
  searchFood as searchFoodService,
  saveSearchHistory,
  userLikeOrUnlikeFoodPost,
  IPostFoodData,
  updateFoodPost as updateFoodPostService,
  getLikedFood as getLikedFoodPostService,
} from "../services";

interface IPostFoodBody {
  images?: string[];
  title?: string;
  location?: any;
  categories?: string[];
  description?: string;
  quantity?: number;
  duration?: Date; // number | string
  price?: number;
  place?: string;
}

interface IPostFoodExtend extends IPostFoodBody {
  user?: string;
  place?: string;
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
  throwErrorIfInvalidFormat("images", images, [isAllNotEmptyString]);
  throwErrorIfInvalidFormat("categories", categories, [isAllNotEmptyString]);
  throwErrorIfInvalidFormat("duration", duration, [isNumber]);
  throwErrorIfInvalidFormat("location", location, [isLocation]);
  throwErrorIfInvalidFormat("quantity", quantity, [isNumber]);

  return true;
};

export const postFood = async (
  req: Request<{}, {}, IPostFoodBody, {}>,
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
      postFoodService(valData)
        .then((data) => res.status(200).json(toResponseSuccessData(data)))
        .catch(next);
    }
  } catch (error) {
    return next(error);
  }
};

interface IUpdateFoodPostBody extends IPostFoodBody {
  _id?: string;
}
export const updateFoodPost = async (
  req: Request<{}, {}, IUpdateFoodPostBody, {}>,
  res: Response,
  next: NextFunction
) => {
  const id = req.body._id;
  const auth = req.authContext as AuthLike;

  if (!isObjectId(id)) {
    return next(
      new InvalidDataError({
        message: `Invalid _id: ${req.body._id}`,
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
      updateFoodPostService(id, valData)
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

  findFoodPostById(id, auth._id)
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
  searchFoodService(paramsToSearch)
    .then((data) => {
      res.status(200).json(toResponseSuccessData(data));

      // Save the history
      saveSearchHistory(auth._id, paramsToSearch);
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
  userLikeOrUnlikeFoodPost(auth._id, foodId!, action === "LIKE")
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

  getLikedFoodPostService(user, pagination)
    .then((data) => res.status(200).json(toResponseSuccessData(data)))
    .catch(next);
};
