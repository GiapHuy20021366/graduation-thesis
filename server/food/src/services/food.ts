import { HydratedDocument } from "mongoose";
import {
  Actived,
  IFoodPostExposed,
  IFoodPostExposedPlace,
  IFoodPostExposedUser,
  IFoodPostExposedWithLike,
  IFoodPostLocation,
  IFoodSearchParams,
  IFoodSearchPopulate,
  IFoodUserLikeExposed,
  IPagination,
  IPostFoodData,
  InternalError,
  OrderState,
  PlaceType,
  QueryBuilder,
  Resolved,
  ResourceNotExistedError,
  UnauthorizationError,
  isArrayPlaceTypes,
  toFoodPostExposed,
  toFoodUserLikeExposed,
} from "../data";
import { FoodPost, FoodUserLike, IFoodPostSchema } from "../db/model";
import {
  IPlaceIdAndType,
  Id,
  rpcGetDictPlace,
  rpcGetDictUser,
  rpcGetPlace,
  rpcGetUser,
} from "./rpc";
import { notifyLikedFood, notifySharedFoodToSubcribers } from "./checker";

export interface IPostFoodResponse
  extends Pick<
    IFoodPostExposed,
    "_id" | "createdAt" | "active" | "updatedAt"
  > {}

const toFoodPostResponse = (
  data: HydratedDocument<IFoodPostSchema>
): IPostFoodResponse => {
  return {
    _id: data._id.toString(),
    active: data.active,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
  };
};

export const postFood = async (
  data: IPostFoodData
): Promise<IPostFoodResponse> => {
  // Check user and place existed
  const [user, place] = await Promise.all([
    rpcGetUser<Id>(data.user, "_id"),
    rpcGetPlace<IPlaceIdAndType>(data.place, "_id type"),
  ]);
  if (user == null) {
    throw new InternalError({
      data: {
        target: "rpc-user",
        reason: "unknown",
      },
    });
  }
  if (data.place != null && place == null) {
    throw new InternalError({
      data: {
        target: "rpc-user",
        reason: "unknown",
      },
    });
  }

  const { lat, lng } = data.location.coordinates;
  const locationWith2D: IFoodPostLocation = {
    ...data.location,
    two_array: [lng, lat],
  };

  const foodPost = new FoodPost({
    ...data,
    location: locationWith2D,
    user: data.user,
    place: place,
  });

  await foodPost.save();

  // Notify to subcribers
  notifySharedFoodToSubcribers(foodPost);

  return toFoodPostResponse(foodPost);
};

export const updateFoodPost = async (
  foodId: string,
  data: IPostFoodData
): Promise<IPostFoodResponse> => {
  const foodPost = await FoodPost.findById(foodId);
  if (foodPost == null) {
    throw new ResourceNotExistedError({
      message: `No food post with id ${foodId} found`,
      data: {
        reason: "not-found",
        target: "_id",
      },
    });
  }

  // Update place if it different
  if (data.place != foodPost.place?._id) {
    if (foodPost.place != null && data.place == null) {
      foodPost.place = undefined;
    } else {
      const rpcPlace = await rpcGetPlace<IPlaceIdAndType>(foodPost.place?._id);
      if (rpcPlace == null) {
        throw new InternalError({
          data: {
            target: "rpc-user",
            reason: "unknown",
          },
        });
      } else {
        foodPost.place = rpcPlace;
      }
    }
  }

  foodPost.updatedAt = new Date();
  foodPost.isEdited = true;
  foodPost.title = data.title;
  foodPost.duration = data.duration;
  foodPost.images = data.images;
  foodPost.location = data.location;
  foodPost.categories = data.categories;
  foodPost.description = data.description;
  foodPost.quantity = data.quantity;
  foodPost.price = data.price;

  await foodPost.save();
  return toFoodPostResponse(foodPost);
};

export const findFoodPostById = async (
  id: string,
  userId?: string
): Promise<IFoodPostExposedWithLike> => {
  const foodPost = await FoodPost.findById(id);
  if (foodPost == null) {
    throw new ResourceNotExistedError({
      message: `No food post with id ${id} found`,
      data: {
        target: "id",
        reason: "not-found",
      },
    });
  }

  const result: IFoodPostExposedWithLike = {
    ...toFoodPostExposed(foodPost, { description: true }),
    liked: false,
  };

  const [user, place] = await Promise.all([
    rpcGetUser<IFoodPostExposedUser>(
      foodPost.user,
      "_id firstName lastName avatar location"
    ),
    rpcGetPlace<IFoodPostExposedPlace>(
      foodPost.place?._id,
      "_id exposedName avatar type location"
    ),
  ]);

  if (user != null) {
    result.user = user;
  }
  if (place != null) {
    result.place = place;
  }

  if (userId) {
    const liked = await FoodUserLike.findOne({
      user: userId,
      foodPost: foodPost._id,
    });
    if (liked != null) {
      result.liked = true;
      result.like = {
        _id: liked._id.toString(),
        createdAt: liked.createdAt,
        foodPost: foodPost._id.toString(),
        user: userId,
      };
    }
  }

  return result;
};

const toFoodSearchBuilder = (params: IFoodSearchParams): QueryBuilder => {
  const { query, addedBy, duration, time, pagination, distance, order } =
    params;

  const builder = new QueryBuilder();

  // Base
  builder
    .pagination(pagination)
    .value("active", params.active)
    .value("resolved", params.resolved)
    .array("categories", params.category)
    .minMax("quantity", params.quantity)
    .minMax("price", params.price)
    .minMax("createdAt", { min: time?.from, max: time?.to })
    .minMax("duration", { min: duration?.from, max: duration?.to })
    .incAndExc("resolveBy", params.resolveBy)
    .incAndExc("user", params.user)
    .incAndExc("place._id", params.place);
  if (addedBy != null) {
    if (typeof addedBy === "number") {
      if (addedBy === PlaceType.PERSONAL) {
        builder.options["place.type"] = null;
      } else {
        builder.value("place.type", addedBy);
      }
    } else if (isArrayPlaceTypes(addedBy)) {
      const isPersonalIncluded = addedBy.includes(PlaceType.PERSONAL);
      const types: PlaceType[] = [];
      addedBy.forEach((type) => {
        if (type !== PlaceType.PERSONAL) {
          types.push(type);
        }
      });
      if (isPersonalIncluded) {
        builder.value("place.type", {
          $or: [null, { $in: types }],
        });
      } else {
        builder.value("place.type", {
          $in: addedBy,
        });
      }
    }
  }

  if (query != null && query.length > 0) {
    builder.value("$text", {
      $search: query,
    });
    if (distance != null) {
      const { max, current } = distance;
      builder.value("location.two_array", {
        $geoWithin: {
          $centerSphere: [[current.lng, current.lat], max / 6371],
        },
      });
    }

    builder.order("score", {
      $meta: "textScore",
    });
    builder.me("score", {
      $meta: "textScore",
    });
  } else {
    // Around
    if (distance != null) {
      const { current } = distance;
      builder.value("location.two_array", {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [current.lng, current.lat],
          },
          $maxDistance:
            distance.max === Number.MAX_SAFE_INTEGER
              ? distance.max
              : distance.max * 1000,
        },
      });
    }
  }

  // order
  builder.order("location.two_array", order?.distance);
  builder.order("createdAt", order?.time);
  builder.order("price", order?.price);
  builder.order("quantity", order?.quantity);

  return builder;
};

export const searchFood = async (
  params: IFoodSearchParams
): Promise<IFoodPostExposed[]> => {
  const builder = toFoodSearchBuilder(params);
  const posts = await FoodPost.find(builder.options, builder.meta)
    .sort(builder.sort)
    .skip(builder.skip)
    .limit(builder.limit)
    .exec();

  if (posts == null) throw new InternalError();

  const result: IFoodPostExposed[] = posts.map((post) =>
    toFoodPostExposed(post)
  );

  return populateFoodUsersAndPlaces(
    result,
    params.populate
  ) as unknown as IFoodPostExposed[];
};

export const populateFoodUsersAndPlaces = async (
  data: IFoodPostExposed[],
  options?: IFoodSearchPopulate
): Promise<unknown[]> => {
  const requireUser = options?.user !== false;
  const requirePlace = options?.place !== false;

  const users: string[] = [];
  const places: string[] = [];
  data.forEach((post) => {
    const user = post.user as string;
    const place = post.place as string | undefined;
    requireUser && !users.includes(user) && users.push(user);
    requirePlace && place && !places.includes(place) && places.push(place);
  });

  const [userDict, placeDict] = await Promise.all([
    rpcGetDictUser<Record<string, IFoodPostExposedUser>>(
      users,
      "_id firstName lastName avatar location"
    ),
    rpcGetDictPlace<Record<string, IFoodPostExposedPlace>>(
      places,
      "_id exposedName avatar type location"
    ),
  ]);

  if (requireUser || requirePlace) {
    data.forEach((post) => {
      if (userDict != null) {
        const user = userDict[post.user as string];
        if (user) {
          post.user = user;
        }
      }
      if (placeDict != null && post.place != null) {
        const place = placeDict[post.place as string];
        if (place) {
          post.place = place;
        }
      }
    });
  }
  return data;
};

export const userLikeOrUnlikeFoodPost = async (
  userId: string,
  foodPostId: string,
  like?: boolean
): Promise<IFoodUserLikeExposed | null> => {
  const foodPost = await FoodPost.findById(foodPostId);
  if (foodPost == null) {
    throw new ResourceNotExistedError({
      message: `No food post with id ${foodPostId} found`,
      data: {
        target: "food-post",
        reason: "not-found",
      },
    });
  }

  const liked = await FoodUserLike.findOne({
    foodPost: foodPostId,
    user: userId,
  });

  // Like but already like
  if (liked != null && like) {
    return toFoodUserLikeExposed(liked);
  }

  // Like when no already like
  if (liked == null && like) {
    const newLike = new FoodUserLike({
      foodPost: foodPostId,
      user: userId,
    });
    await newLike.save();
    const newLikeCount = (foodPost.likeCount ?? 0) + 1;
    foodPost.likeCount = newLikeCount;
    await foodPost.save();
    // Notify
    notifyLikedFood(foodPost.user, foodPostId);
    return toFoodUserLikeExposed(newLike);
  }

  // Unlike when has no already like
  if (liked == null && !like) {
    return null;
  }

  // Unlike and has like before
  if (liked != null && !like) {
    await FoodUserLike.deleteOne({ _id: liked._id });
    const newLikeCount = Math.max((foodPost.likeCount ?? 0) - 1, 0);
    foodPost.likeCount = newLikeCount;
    await foodPost.save();
    return toFoodUserLikeExposed(liked);
  }

  return null;
};

export const getLikedFoods = async (
  userId: string,
  pagination?: IPagination
): Promise<IFoodPostExposedWithLike[]> => {
  const builder = new QueryBuilder();
  builder.value("user", userId);
  builder.order("createdAt", OrderState.DECREASE);
  builder.pagination(pagination);

  const likes = await FoodUserLike.find(builder.options)
    .populate<{
      foodPost: HydratedDocument<IFoodPostSchema>;
    }>("foodPost")
    .sort(builder.sort)
    .skip(builder.skip)
    .limit(builder.limit);

  if (likes == null) {
    throw new InternalError();
  }

  const result = likes
    .filter((like) => like.foodPost != null)
    .map((like): IFoodPostExposedWithLike => {
      const post = like.foodPost;
      return {
        ...toFoodPostExposed(post),
        liked: true,
        like: {
          _id: like._id.toString(),
          createdAt: like.createdAt,
          foodPost: post._id.toString(),
          user: userId,
        },
      };
    });

  return populateFoodUsersAndPlaces(
    result
  ) as unknown as IFoodPostExposedWithLike[];
};

export const resolveFood = async (
  userId: string,
  foodId: string,
  resolveBy: string | null
): Promise<Partial<Resolved>> => {
  const food = await FoodPost.findById(foodId);
  if (food == null) {
    throw new ResourceNotExistedError();
  }
  if (food.user.toString() !== userId) {
    throw new UnauthorizationError();
  }
  if (resolveBy == null) {
    food.resolveBy = undefined;
    food.resolveTime = undefined;
    food.resolved = false;
    await food.save();
    return {
      resolved: false,
    };
  } else {
    const now = new Date();
    food.resolveBy = resolveBy;
    food.resolved = true;
    food.resolveTime = now;
    await food.save();
    return {
      resolved: true,
      resolveBy: resolveBy,
      resolveTime: now,
    };
  }
};

export const activeFood = async (
  userId: string,
  foodId: string,
  active: boolean
): Promise<Actived> => {
  const food = await FoodPost.findById(foodId);
  if (food == null) {
    throw new ResourceNotExistedError();
  }
  if (food.user.toString() !== userId) {
    throw new UnauthorizationError();
  }
  if (food.active !== active) {
    food.active = active;
    await food.save();
  }
  return {
    active: active,
  };
};
