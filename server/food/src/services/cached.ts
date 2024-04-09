import mongoose, { HydratedDocument } from "mongoose";
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
import { USER_TO_REGISTERED_MAX_DURATION } from "~/config";

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

  let user: IdAndLocationAndCategories | null = null;
  if (options?.basic !== false) {
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
    await cached.save();
  }

  if (options?.register !== false) {
    // Call user service to get places/user registered
    const registerData = await rpcGetRegisters<IUserCachedRegister>(userId);
    if (registerData == null) {
      throw new InternalError();
    }
    cached.register.users = registerData.users;
    cached.register.places = registerData.places;
    cached.register.updatedAt = new Date();
    await cached.save();
  }

  if (options?.favorite !== false) {
    // Call user service to get categories of place rated
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
    await cached.save();
  }

  return cached;
};

export const getRatedCategoryScore = async (
  userId: string
): Promise<Pick<IUserCachedFavorite, "loveds">> => {
  const result: Pick<IUserCachedFavorite, "loveds"> = {
    loveds: [],
  };

  const datas = await FoodUserLike.aggregate<IUserCachedFavoriteScore>([
    {
      $match: { user: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "foods",
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
      $project: {
        _id: 0,
        category: "$_id",
        score: "$score",
      },
    },
    {
      $sort: { count: -1 },
    },
  ]);

  result.loveds = datas;
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
