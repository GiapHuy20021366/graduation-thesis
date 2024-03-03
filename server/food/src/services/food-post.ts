import {
  IFoodPost,
  IFoodPostExposed,
  IFoodPostExposedPlace,
  IFoodPostExposedUser,
  IFoodPostLocation,
  IFoodSearchParams,
  InternalError,
  PlaceType,
  ResourceNotExistedError,
  isArrayPlaceTypes,
} from "../data";
import { FoodPost, FoodUserLike } from "../db/model";
import {
  IPlaceIdAndType,
  Id,
  rpcGetDictPlace,
  rpcGetDictUser,
  rpcGetPlace,
  rpcGetUser,
} from "./rpc";

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

const toFoodSearchCommonOptions = (
  params: IFoodSearchParams
): Record<string, any> => {
  const options: Record<string, any> = {};
  const {
    active,
    addedBy,
    available,
    category,
    maxDuration,
    minQuantity,
    place,
    price,
    user,
  } = params;

  if (active != null) {
    options.active = active;
  }

  if (addedBy != null) {
    if (typeof addedBy === "string") {
      if (addedBy !== PlaceType.PERSONAL) {
        options["place.type"] = null;
      } else {
        options["place.type"] = addedBy;
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
        options["place.type"] = {
          $or: [null, { $in: types }],
        };
      } else {
        options["place.type"] = {
          $in: addedBy,
        };
      }
    }
  }

  if (available != null) {
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

  if (category != null) {
    if (typeof category === "string") {
      options["categories"] = {
        $in: [category],
      };
    } else {
      options["categories"] = {
        $in: category,
      };
    }
  }

  if (maxDuration != null) {
    options["duration"] = {
      $gte: Date.now() + maxDuration * 24 * 60 * 60 * 1000, // days to miliseconds
    };
  }

  if (minQuantity != null) {
    options["quantity"] = {
      $gte: minQuantity,
    };
  }

  if (price != null) {
    const priceOption: any = {};
    if (price.min != null) {
      priceOption.$gte = price.min;
    }
    if (price.max != null) {
      priceOption.$lte = price.max;
    }
    if (Object.keys(priceOption).length > 0) {
      options["price"] = priceOption;
    }
  }

  if (place != null) {
    const include = place.include;
    const placeIdOption: any = {};

    if (typeof include === "string") {
      placeIdOption.$eq = include;
    } else if (Array.isArray(include)) {
      placeIdOption.$in = include;
    }

    const exclude = place.exclude;
    if (typeof exclude === "string") {
      placeIdOption.$neq = exclude;
    } else if (Array.isArray(exclude)) {
      placeIdOption.$nin = exclude;
    }

    if (Object.keys(placeIdOption).length > 0) {
      options["place._id"] = placeIdOption;
    }
  }

  if (user != null) {
    const include = user.include;
    const userOption: any = {};

    if (typeof include === "string") {
      userOption.$eq = include;
    } else if (Array.isArray(include)) {
      userOption.$in = include;
    }

    const exclude = user.exclude;
    if (typeof exclude === "string") {
      userOption.$neq = exclude;
    } else if (Array.isArray(exclude)) {
      userOption.$nin = exclude;
    }

    if (Object.keys(userOption).length > 0) {
      options["user"] = userOption;
    }
  }

  return options;
};

export const searchFood = async (
  params: IFoodSearchParams
): Promise<IFoodPostExposed[]> => {
  const commonOptions = toFoodSearchCommonOptions(params);
  const { distance, order, pagination, populate, query } = params;
  const options: any = {};
  const meta: any = {};
  const sort: any = {};

  if (query && query.length > 0) {
    options["$text"] = {
      $search: query,
    };
  }

  // max distance on location
  if (distance != null) {
    const { max, current } = distance;
    options["location.two_array"] = {
      $geoWithin: {
        $center: [[current.lng, current.lat], max],
      },
    };
  }

  if (order) {
    if (order.distance) {
      sort["location.two_array"] = order.distance;
    }
    if (order.time) {
      sort["createdAt"] = order.time;
    }
    if (order.price) {
      sort["price"] = order.price;
    }
    if (order.quantity) {
      sort["quantity"] = order.quantity;
    }
  }

  // score final
  if (query && query.length > 0) {
    sort["score"] = {
      $meta: "textScore",
    };
    meta["score"] = {
      $meta: "textScore",
    };
  }

  const queryBuilder = FoodPost.find(
    {
      ...options,
      ...commonOptions,
    },
    meta
  ).sort(sort);

  // Pagination
  queryBuilder.skip(pagination?.skip ?? 0).limit(pagination?.limit ?? 24);

  const posts = await queryBuilder.exec();
  if (posts == null) throw new InternalError();

  const result: IFoodPostExposed[] = posts.map((post) => ({
    _id: post._id.toString(),
    active: post.active,
    categories: post.categories,
    createdAt: post.createdAt,
    description: post.description,
    duration: post.duration,
    images: post.images,
    isEdited: post.isEdited,
    likeCount: post.likeCount,
    location: post.location,
    price: post.price,
    quantity: post.quantity,
    title: post.title,
    updatedAt: post.updatedAt,
    user: post.user,
    place: post.place?._id,
  }));

  if (populate != null) {
    const requireUser = populate.user !== false;
    const requirePlace = populate.place !== false;

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
        "_id firstName lastName avartar location"
      ),
      rpcGetDictPlace<Record<string, IFoodPostExposedPlace>>(
        places,
        "_id exposeName avartar type location"
      ),
    ]);

    if (requireUser || requireUser) {
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
