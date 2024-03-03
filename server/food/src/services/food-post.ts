import {
  IFoodPost,
  IFoodPostExposed,
  IFoodPostExposedPlace,
  IFoodPostExposedUser,
  IFoodPostLocation,
  IFoodSearchParams,
  InternalError,
  OrderState,
  ResourceNotExistedError,
  toDistance,
} from "../data";
import { FoodPost, IFoodPostSchema, FoodUserLike } from "../db/model";
import { IPlaceIdAndType, Id, rpcGetPlace, rpcGetUser } from "./rpc";

export interface IPostFoodData extends Omit<IFoodPost, "place"> {
  place?: string;
}

export interface IPostFoodResponse {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

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

  return {
    _id: foodPost._id.toString(),
    createdAt: foodPost.createdAt,
    updatedAt: foodPost.updatedAt,
    active: foodPost.active,
  };
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
  return {
    _id: foodPost._id.toString(),
    createdAt: foodPost.createdAt,
    updatedAt: foodPost.updatedAt,
    active: foodPost.active,
  };
};

interface IFoodPostExposedWithLike extends IFoodPostExposed {
  liked?: boolean;
}

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
    _id: foodPost._id.toString(),
    active: foodPost.active,
    categories: foodPost.categories,
    createdAt: foodPost.createdAt,
    description: foodPost.description,
    duration: foodPost.duration,
    images: foodPost.images,
    isEdited: foodPost.isEdited,
    likeCount: foodPost.likeCount,
    location: foodPost.location,
    price: foodPost.price,
    quantity: foodPost.quantity,
    title: foodPost.title,
    updatedAt: foodPost.updatedAt,
    user: foodPost.user,
    place: foodPost.place?._id,
  };

  const [user, place] = await Promise.all([
    rpcGetUser<IFoodPostExposedUser>(
      foodPost.user,
      "_id firstName lastName avartar location"
    ),
    rpcGetPlace<IFoodPostExposedPlace>(
      foodPost.place?._id,
      "_id exposeName avartar type location"
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
    if (liked != null) result.liked = true;
  }

  return result;
};

export const searchFood = async (
  params: IFoodSearchParams
): Promise<IFoodPostSchema[]> => {
  const {
    currentLocation,
    maxDistance,
    categories,
    available,
    minQuantity,
    maxDuration,
    price,
    pagination,
    order,
  } = params;
  const options: any = {};
  const meta: any = {};
  const sort: any = {};

  if (params.query.length > 0) {
    options["$text"] = {
      $search: params.query,
    };
  }

  // max distance on location
  if (currentLocation) {
    const maxDis =
      maxDistance != undefined ? maxDistance : Number.MAX_SAFE_INTEGER;
    options["location.two_array"] = {
      $geoWithin: {
        $center: [[currentLocation.lng, currentLocation.lat], maxDis],
      },
    };
  }
  // categories
  if (categories) {
    options["categories"] = {
      $in: categories,
    };
  }

  // Available
  if (available) {
    switch (available) {
      case "ALL":
        break;
      case "AVAILABLE_ONLY":
        options["duration"] = {
          $gt: Date.now(),
        };
        break;
      case "JUST_GONE":
        options["duration"] = {
          $lte: Date.now(),
        };
        break;
    }
  }

  // Quantity
  if (minQuantity) {
    options["quantity"] = {
      $gte: minQuantity,
    };
  }

  // Max duration
  if (maxDuration) {
    options["duration"] = {
      $gte: Date.now() + maxDuration * 24 * 60 * 60 * 1000, // days to miliseconds
    };
  }

  if (price && price.active) {
    options["price"] = {
      $gte: price.min,
      $lte: price.max,
    };
  }

  if (order) {
    if (order.orderNew) {
      sort["createdAt"] = order.orderNew;
    }
    if (order.orderPrice) {
      sort["price"] = order.orderPrice;
    }
    if (order.orderQuantity) {
      sort["quantity"] = order.orderQuantity;
    }
  }

  // score final
  if (params.query.length > 0) {
    sort["score"] = {
      $meta: "textScore",
    };
    meta["score"] = {
      $meta: "textScore",
    };
  }

  const query = FoodPost.find(options, meta).sort(sort);

  // Pagination
  if (pagination) {
    query.skip(pagination.skip).limit(pagination.limit);
  }

  const result = await query.exec();
  if (result == null) throw new InternalError();

  // Sort follow location
  if (order) {
    if (currentLocation && order.orderDistance) {
      result.sort((f1, f2) => {
        const pos1 = f1.location.coordinates;
        const pos2 = f2.location.coordinates;
        const delta =
          toDistance(pos1, currentLocation) - toDistance(pos2, currentLocation);
        if (order.orderDistance === OrderState.INCREASE) return delta;
        return -delta;
      });
      sort["location.two_array"] = order.orderDistance;
    }
  }
  return result;
};

export const userLikeOrUnlikeFoodPost = async (
  userId: string,
  foodPostId: string,
  like?: boolean
) => {
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
    return liked;
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
    return newLike;
  }

  // Unlike when has no already like
  if (liked == null && !like) {
    return;
  }

  // Unlike and has like before
  if (liked != null && !like) {
    await FoodUserLike.deleteOne({ _id: liked._id });
    const newLikeCount = Math.max((foodPost.likeCount ?? 0) - 1, 0);
    foodPost.likeCount = newLikeCount;
    await foodPost.save();
    return liked;
  }
};
