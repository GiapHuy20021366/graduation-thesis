import { HydratedDocument } from "mongoose";
import {
  IUserCached,
  IUserCachedFavorite,
  IUserCachedFavoriteScore,
  IUserCachedRegister,
  InternalError,
} from "../data";
import { FoodUserLike, IUserCachedSchema, UserCached } from "../db/model";
import {
  IdAndLocationAndCategories,
  rpcGetRatedScores,
  rpcGetRegisters,
  rpcGetUser,
} from "./rpc";
import { USER_TO_REGISTERED_MAX_DURATION } from "../config";

export const updatings = new Set<string>();

export interface IUserCachedUpdateOptions {
  favorite?: boolean;
  register?: boolean;
  basic?: boolean;
}

export const updateUserCached = async (
  cached: HydratedDocument<IUserCachedSchema>,
  options?: IUserCachedUpdateOptions
): Promise<HydratedDocument<IUserCachedSchema>> => {
  const userId = cached.user;
  if (updatings.has(userId)) {
    return cached;
  }
  updatings.add(userId);
  const promises: (() => Promise<any>)[] = [];

  let user: IdAndLocationAndCategories | null = null;
  if (options?.basic !== false) {
    promises.push(async () => {
      user = await rpcGetUser<IdAndLocationAndCategories>(
        userId,
        "_id location categories"
      );
      if (user == null) {
        throw new InternalError();
      }
      cached.location = user.location;
      cached.categories = user.categories;
      cached.updatedAt = new Date();
    });
  }

  if (options?.register !== false) {
    // Call user service to get places/user registered
    promises.push(async () => {
      const registerData = await rpcGetRegisters<IUserCachedRegister>(userId);
      if (registerData == null) {
        throw new InternalError();
      }
      cached.register.users = registerData.users;
      cached.register.places = registerData.places;
      cached.register.updatedAt = new Date();
    });
  }

  if (options?.favorite !== false) {
    // Call user service to get categories of place rated
    promises.push(async () => {
      const ratedDatas = await rpcGetRatedScores<IUserCachedFavoriteScore[]>(
        userId
      );
      if (ratedDatas == null) {
        throw new InternalError();
      }
      cached.favorite.rateds = ratedDatas;

      // Check db to get food rated
      const lovedDatas = await getRatedCategoryScore(userId);
      cached.favorite.loveds = lovedDatas.loveds;

      cached.favorite.updatedAt = new Date();
    });
  }

  await Promise.all(promises.map((p) => p())).finally(async () => {
    await cached.save();
    updatings.delete(userId);
  });

  return cached;
};

export const getRatedCategoryScore = async (
  userId: string
): Promise<Pick<IUserCachedFavorite, "loveds">> => {
  const result: Pick<IUserCachedFavorite, "loveds"> = {
    loveds: [],
  };

  const datas = await FoodUserLike.aggregate<{
    _id: string;
    count: number;
  }>([
    {
      $match: { user: userId },
    },
    {
      $lookup: {
        from: "food-posts",
        localField: "foodPost",
        foreignField: "_id",
        as: "food",
      },
    },
    {
      $unwind: "$food",
    },
    {
      $unwind: "$food.categories",
    },
    {
      $group: {
        _id: "$food.categories",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]).exec();

  result.loveds = datas.map((d) => ({ category: d._id, score: d.count }));
  return result;
};

export const getUserCached = async (
  userId: string,
  options?: IUserCachedUpdateOptions,
  lazy?: boolean
): Promise<IUserCached | null> => {
  let result: IUserCached | null = null;
  const cached = await UserCached.findOne({
    user: userId,
  });
  if (cached == null) {
    const userCached = new UserCached({
      user: userId,
      categories: [],
      favorite: {
        loveds: [],
        rateds: [],
      },
      register: {
        places: [],
        users: [],
      },
    });
    await updateUserCached(userCached, options);
    result = {
      categories: userCached.categories,
      favorite: userCached.favorite,
      register: userCached.register,
      user: userCached.user,
      location: userCached.location,
    };
  } else {
    const _options = options ?? {};
    if (options?.basic !== false) {
      const updated = new Date(cached.updatedAt).getTime();
      if (Date.now() - updated < USER_TO_REGISTERED_MAX_DURATION) {
        _options.basic = false;
      }
    }
    if (options?.favorite !== false) {
      const updated = new Date(cached.favorite.updatedAt).getTime();
      if (Date.now() - updated < USER_TO_REGISTERED_MAX_DURATION) {
        _options.favorite = false;
      }
    }
    if (options?.register !== false) {
      const updated = new Date(cached.register.updatedAt).getTime();
      if (Date.now() - updated < USER_TO_REGISTERED_MAX_DURATION) {
        _options.register = false;
      }
    }
    if (lazy !== false) {
      result = {
        categories: cached.categories,
        favorite: cached.favorite,
        register: cached.register,
        user: cached.user,
        location: cached.location,
      };
      updateUserCached(cached, _options);
    } else {
      const newCached = await updateUserCached(cached, _options);
      result = {
        categories: newCached.categories,
        favorite: newCached.favorite,
        register: newCached.register,
        user: newCached.user,
        location: newCached.location,
      };
    }
  }
  return result;
};
