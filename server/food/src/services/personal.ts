import {
  IFoodPostExposed,
  IPagination,
  IUserCachedFavoriteScore,
} from "~/data";
import { getUserCached } from "./cached";
import { FoodPost, IFoodPostSchema } from "../db/model";
import { HydratedDocument } from "mongoose";

const toCategoryRanks = (
  categories: string[],
  loveds: IUserCachedFavoriteScore[],
  rateds: IUserCachedFavoriteScore[]
): Record<string, number> => {
  const result: Record<string, number> = {};
  categories.forEach((c) => {
    if (result[c] == null) {
      result[c] = 100;
    } else {
      result[c] += 100;
    }
  });
  loveds.forEach(({ category, score }) => {
    if (result[category] == null) {
      result[category] = score;
    } else {
      result[category] += score;
    }
  });
  rateds.forEach(({ category, score }) => {
    if (result[category] == null) {
      result[category] = score;
    } else {
      result[category] += score;
    }
  });
  return result;
};

export const getFavoriteFoods = async (
  userId: string,
  pagination?: IPagination
): Promise<IFoodPostExposed[]> => {
  const cached = await getUserCached(userId);
  const location = cached?.location?.coordinates;
  if (cached == null || location == null) return [];

  const { categories, favorite } = cached;
  const { loveds, rateds } = favorite;
  const categoryToScrore = toCategoryRanks(categories, loveds, rateds);

  if (Object.keys(categoryToScrore).length === 0) {
    return [];
  }

  const foods = await FoodPost.aggregate<HydratedDocument<IFoodPostSchema>>([
    {
      $geoNear: {
        near: { type: "Point", coordinates: [location.lng, location.lat] },
        distanceField: "distance",
        maxDistance: 15000,
        spherical: true,
      },
    },
    {
      $match: {
        active: true,
        resolved: false,
        user: {
          $ne: userId,
        },
        duration: {
          $gt: new Date(),
        },
        // "location.two_array": {
        //   $geoWithin: {
        //     $centerSphere: [[location.lng, location.lat], 15000 / 6378100],
        //   },
        // },
      },
    },
    {
      $addFields: {
        totalScore: {
          $reduce: {
            input: "$categories",
            initialValue: 0,
            in: {
              $add: ["$$value", { $ifNull: [categoryToScrore["$$this"], 0] }],
            },
          },
        },
      },
    },
    {
      $sort: { totalScore: -1 },
    },
    { $skip: pagination?.skip ?? 0 },
    { $limit: pagination?.limit ?? 24 },
  ]).exec();

  console.log(foods.length);

  return foods.map((p) => ({
    _id: p._id.toString(),
    active: p.active,
    categories: p.categories,
    createdAt: p.createdAt,
    duration: p.duration,
    images: p.images,
    isEdited: p.isEdited,
    likeCount: p.likeCount,
    location: p.location,
    price: p.price,
    quantity: p.quantity,
    title: p.title,
    user: p.user,
    place: p.place?._id,
    updatedAt: p.updatedAt,
    description: "",
  }));
};

export const getRegisteredFoods = async (
  userId: string,
  pagination?: IPagination
): Promise<IFoodPostExposed[]> => {
  const cached = await getUserCached(userId);
  if (cached == null) return [];

  const { register } = cached;
  const { places, users } = register;
  const ids = places.map((p) => p._id).concat(users.map((u) => u._id));
  if (ids.length === 0) return [];

  const foods = await FoodPost.find({
    $or: [
      {
        "place._id": {
          $in: ids,
        },
      },
      {
        user: {
          $in: ids,
        },
      },
    ],
    duration: {
      $gt: Date.now(),
    },
    active: true,
    resolved: false,
  })
    .skip(pagination?.skip ?? 0)
    .limit(pagination?.limit ?? 24)
    .sort({
      updatedAt: -1,
    })
    .exec();

  return foods.map((p) => ({
    _id: p._id.toString(),
    active: p.active,
    categories: p.categories,
    createdAt: p.createdAt,
    duration: p.duration,
    images: p.images,
    isEdited: p.isEdited,
    likeCount: p.likeCount,
    location: p.location,
    price: p.price,
    quantity: p.quantity,
    title: p.title,
    user: p.user,
    place: p.place?._id,
    updatedAt: p.updatedAt,
    description: "",
  }));
};
