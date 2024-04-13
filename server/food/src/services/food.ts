import { HydratedDocument } from "mongoose";
import {
  IFoodPostExposed,
  IFoodPostExposedPlace,
  IFoodPostExposedUser,
  IFoodPostExposedWithLike,
  IFoodPostLocation,
  IFoodSearchParams,
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
      "_id exposeName avatar type location"
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
  const {
    query,
    addedBy,
    available,
    maxDuration,
    pagination,
    distance,
    order,
  } = params;

  const builder = new QueryBuilder();

  // Base
  builder
    .pagination(pagination)
    .value("active", params.active)
    .value("resolved", params.resolved)
    .array("categories", params.category)
    .min("quantity", params.minQuantity)
    .minMax("price", params.price)
    .incAndExc("resolveBy", params.resolveBy)
    .incAndExc("user", params.user)
    .incAndExc("place._id", params.place);
  if (addedBy != null) {
    if (typeof addedBy === "number") {
      if (addedBy === PlaceType.PERSONAL) {
        builder.value("place.type", null);
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

  if (available != null) {
    switch (available) {
      case "ALL":
        break;
      case "AVAILABLE_ONLY":
        builder.min("duration", Date.now());
        break;
      case "JUST_GONE":
        builder.max("duration", Date.now());
        break;
    }
  }

  if (maxDuration != null && available !== "JUST_GONE") {
    builder.min("duration", Date.now() + maxDuration * 24 * 60 * 60 * 1000);
  }

  if (query) {
    // Query
    builder.value("$text", {
      $search: query,
    });

    // max distance on location
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

  // Populate result
  const populate = params.populate;
  const requireUser = populate?.user !== false;
  const requirePlace = populate?.place !== false;

  const users: string[] = [];
  const places: string[] = [];
  posts.forEach((post) => {
    const user = post.user;
    const place = post.place?._id;
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
      "_id exposeName avatar type location"
    ),
  ]);

  if (requireUser || requirePlace) {
    result.forEach((post) => {
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

  return result;
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

  return likes
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
