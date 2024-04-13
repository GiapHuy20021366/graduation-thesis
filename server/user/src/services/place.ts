import { IPlaceSearchParams } from "~/data/place-search-params";
import {
  FollowRole,
  FollowType,
  ICoordinates,
  IPagination,
  IPlaceData,
  IPlaceExposedAuthor,
  IPlaceExposed,
  IRating,
  InternalError,
  OrderState,
  PlaceType,
  ResourceNotExistedError,
  UnauthorizationError,
  toPlaceExposed,
  Actived,
  Followed,
  QueryBuilder,
  IPlaceExposedWithRatingAndFollow,
} from "../data";
import { Follower, IPlaceSchema, Place, PlaceRating } from "../db/model";
import { HydratedDocument } from "mongoose";

export const createNewPlace = async (data: IPlaceData, authorId: string) => {
  const dataToCreate = { ...data, authorId: authorId };
  const coordinates = data.location.coordinates;
  dataToCreate.location.two_array = [coordinates.lng, coordinates.lat];

  const newPlace = new Place({
    ...dataToCreate,
    author: authorId,
  });
  await newPlace.save();

  const follower = new Follower({
    place: newPlace._id,
    subcriber: authorId,
    type: FollowType.ADMIN,
    role: FollowRole.PLACE,
  });
  await follower.save();

  return toPlaceExposed(newPlace);
};

export const updatePlace = async (
  newData: IPlaceData,
  placeId: string,
  userId: string
) => {
  const place = await Place.findById(placeId).populate<{
    author: IPlaceExposedAuthor;
  }>("author");
  if (place == null) {
    throw new ResourceNotExistedError({
      message: `No place with id ${placeId} found`,
      data: {
        reason: "not-found",
        target: "place-id",
      },
    });
  }

  const follower = await Follower.findOne({
    place: placeId,
    subcriber: userId,
    role: FollowRole.PLACE,
  });

  if (follower == null) {
    throw new UnauthorizationError({
      message: `Access deny for user ${userId}, place ${placeId}`,
      data: {
        target: "active",
        reason: "unauthorization",
      },
    });
  }

  if (!(follower.type & FollowType.ADMIN)) {
    throw new UnauthorizationError({
      message: `Access deny for user ${userId}, place ${placeId}`,
      data: {
        target: "active",
        reason: "unauthorization",
      },
    });
  }

  // update !!!
  place.categories = newData.categories;
  place.description = newData.description ?? "";
  place.exposeName = newData.exposeName;
  place.images = newData.images;
  place.location = newData.location;
  place.type = newData.type;
  place.avatar = newData.avatar;
  place.updatedAt = new Date();

  await place.save();
  place.author;

  const result: IPlaceExposed = {
    ...toPlaceExposed(place),
  };
  return result;
};

export const activePlace = async (
  placeId: string,
  userId: string,
  active: boolean
): Promise<Actived> => {
  const place = await Place.findById(placeId);
  if (place == null) {
    throw new ResourceNotExistedError({
      message: `No place with id ${placeId} found`,
      data: {
        target: "place-id",
        reason: "not-found",
      },
    });
  }
  const follower = await Follower.findOne({
    place: placeId,
    subcriber: userId,
    role: FollowRole.PLACE,
  });

  if (follower == null) {
    throw new UnauthorizationError({
      message: `Access deny for user ${userId}, place ${placeId}`,
      data: {
        target: "active",
        reason: "unauthorization",
      },
    });
  }

  if (!(follower.type & FollowType.ADMIN)) {
    throw new UnauthorizationError({
      message: `Access deny for user ${userId}, place ${placeId}`,
      data: {
        target: "active",
        reason: "unauthorization",
      },
    });
  }
  if (active !== place.active) {
    place.active = active;
    place.updatedAt = new Date();
    await place.save();
  }
  return {
    active,
  };
};

export const followPlace = async (
  placeId: string,
  userId: string,
  followType: FollowType
): Promise<Followed> => {
  const place = await Place.findById(placeId);
  if (place == null) {
    throw new ResourceNotExistedError({
      message: `No place with id ${placeId} found`,
      data: {
        target: "place-id",
        reason: "not-found",
      },
    });
  }
  const follower = await Follower.findOne({
    place: placeId,
    subcriber: userId,
    role: FollowRole.PLACE,
  });

  if (follower == null) {
    const newFollower = new Follower({
      place: placeId,
      role: FollowRole.PLACE,
      subcriber: userId,
      type: followType,
    });
    await newFollower.save();
    return {
      followed: true,
    };
  } else {
    if (follower.type !== followType) {
      follower.type = followType;
      follower.updatedAt = new Date();
      await follower.save();
    }
    return {
      followed: true,
    };
  }
};

export const unfollowPlace = async (
  placeId: string,
  userId: string
): Promise<Followed> => {
  const place = await Place.findById(placeId);
  if (place == null) {
    throw new ResourceNotExistedError({
      message: `No place with id ${placeId} found`,
      data: {
        target: "place-id",
        reason: "not-found",
      },
    });
  }
  const follower = await Follower.findOne({
    place: placeId,
    subcriber: userId,
    role: FollowRole.PLACE,
  });

  if (follower != null) {
    await follower.deleteOne();
  }

  return {
    followed: false,
  };
};

const toPlaceSearchBuilder = (params: IPlaceSearchParams): QueryBuilder => {
  const { author, distance, order, pagination, query, rating, types } = params;

  const builder = new QueryBuilder();

  // Base
  builder
    .pagination(pagination)
    .minMax("rating.mean", rating)
    .incAndExc("author", author)
    .array("type", types);

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
  builder.order("rating.mean", order?.rating);
  builder.order("location.two_array", order?.distance);

  return builder;
};

export const searchPlaces = async (params: IPlaceSearchParams) => {
  const builder = toPlaceSearchBuilder(params);
  const result = await Place.find(builder.options, builder.meta)
    .sort(builder.sort)
    .skip(builder.skip)
    .limit(builder.limit)
    .exec();
  if (result == null) throw new InternalError();

  return result;
};

export const ratingPlace = async (
  placeId: string,
  userId: string,
  score: number | undefined
): Promise<IRating> => {
  const place = await Place.findById(placeId);
  if (place == null) {
    throw new ResourceNotExistedError({
      message: `No place with id ${placeId} found`,
      data: {
        target: "place-id",
        reason: "not-found",
      },
    });
  }
  const rating = await PlaceRating.findOne({
    place: placeId,
    user: userId,
  });

  const ratingAfter: IRating = {
    mean: 0,
    count: 0,
  };

  const total = place.rating.mean * place.rating.count;
  if (score == null || isNaN(score)) {
    if (rating != null) {
      const newTotal = total - rating.score;
      const newCount = place.rating.count - 1;
      const newMean = newTotal / Math.max(1, newCount);

      place.rating.count = newCount;
      place.rating.mean = newMean;
      await place.save();
      await rating.deleteOne();

      ratingAfter.mean = newMean;
      ratingAfter.count = newCount;
    }
  } else {
    if (rating != null) {
      const newTotal = total - rating.score + score;
      const newMean = newTotal / Math.max(1, place.rating.count);

      // update
      place.rating.mean = newMean;
      rating.score = score;
      rating.updatedAt = new Date();

      await place.save();
      await rating.save();

      ratingAfter.mean = newMean;
      ratingAfter.count = place.rating.count;
    } else {
      const newTotal = total + score;
      const newCount = place.rating.count + 1;
      const newMean = newTotal / Math.max(1, newCount);

      place.rating.count = newCount;
      place.rating.mean = newMean;
      const newRating = new PlaceRating({
        user: userId,
        place: placeId,
        score: score,
      });

      await newRating.save();
      await place.save();

      ratingAfter.mean = newMean;
      ratingAfter.count = newCount;
    }
  }
  return {
    count: ratingAfter.count,
    mean: ratingAfter.mean,
  };
};

export const getPlaceInfo = async (placeId: string, userId?: string) => {
  const place = await Place.findById(placeId).populate<{
    author: IPlaceExposedAuthor;
  }>("author", "firstName lastName _id email");
  if (place == null) {
    throw new ResourceNotExistedError({
      message: `No place with id ${placeId} found`,
      data: {
        target: "place-id",
        reason: "not-found",
      },
    });
  }
  const result: IPlaceExposedWithRatingAndFollow = toPlaceExposed(
    place,
    {
      author: place.author,
    },
    {
      description: true,
    }
  );
  if (userId != null) {
    const follower = await Follower.findOne({
      role: FollowRole.PLACE,
      subcriber: userId,
      place: placeId,
    });
    if (follower) {
      result.userFollow = {
        place: placeId,
        role: FollowRole.PLACE,
        subcriber: userId,
        type: follower.type,
        createdAt: follower.createdAt,
        updatedAt: follower.updatedAt,
      };
    }

    const rating = await PlaceRating.findOne({
      user: userId,
      place: placeId,
    });

    if (rating) {
      result.userRating = {
        place: placeId,
        score: rating.score,
        user: userId,
        createdAt: rating.createdAt,
        updatedAt: rating.updatedAt,
      };
    }

    const followerCount = await Follower.count({
      place: placeId,
      subcriber: {
        $ne: userId,
      },
      role: FollowRole.PLACE,
    }).exec();

    result.subcribers = followerCount;
  }
  return result;
};

export const getPlacesByUser = async (
  user: string,
  pagination?: IPagination
) => {
  return getPlacesByUserFollow(
    user,
    [FollowType.ADMIN, FollowType.SUB_ADMIN],
    undefined,
    pagination
  );
};

export const getPlacesByUserFollow = async (
  user: string,
  followTypes?: FollowType[],
  placeTypes?: PlaceType[],
  pagination?: IPagination
): Promise<IPlaceExposedWithRatingAndFollow[]> => {
  const buider = new QueryBuilder();
  buider
    .pagination(pagination)
    .value("subcriber", user)
    .value("role", FollowRole.PLACE)
    .array("place.type", placeTypes)
    .array("type", followTypes)
    .order("createdAt", OrderState.DECREASE);

  const followers = await Follower.find(buider.options)
    .populate<{ place: HydratedDocument<IPlaceSchema>; subcriber: string }>(
      "place"
    )
    .sort(buider.sort)
    .skip(buider.skip)
    .limit(buider.limit)
    .exec();

  if (followers == null) {
    throw new InternalError();
  }

  return followers
    .filter((f) => f.place != null)
    .map((follower): IPlaceExposedWithRatingAndFollow => {
      return {
        ...toPlaceExposed(follower.place),
        userFollow: {
          place: follower.place._id.toString(),
          role: follower.role,
          subcriber: follower.subcriber,
          type: follower.type,
          createdAt: follower.createdAt,
          updatedAt: follower.updatedAt,
        },
      };
    });
};

export const getPlacesAround = async (
  coordinates: ICoordinates,
  maxDistance?: number,
  types?: PlaceType[],
  exceptAuthors?: string[],
  pagination?: IPagination
): Promise<IPlaceExposed[]> => {
  const places = await Place.find({
    "location.two_array": {
      $nearSphere: {
        $geometry: {
          type: "Point",
          coordinates: [coordinates.lng, coordinates.lat],
        },
      },
      $maxDistance: maxDistance ?? Number.MAX_SAFE_INTEGER,
    },
    author: {
      $nin: exceptAuthors ?? [],
    },
    type: {
      $in: types ?? Object.values(PlaceType),
    },
  })
    .sort({ distance: OrderState.INCREASE })
    .skip(pagination?.skip ?? 0)
    .limit(pagination?.limit ?? 24)
    .exec();

  if (places == null) throw new InternalError();

  return places.map((place): IPlaceExposed => toPlaceExposed(place));
};

export const getPlacesRankByFavorite = async (
  pagination?: IPagination
): Promise<IPlaceExposed[]> => {
  const places = await Place.aggregate([
    {
      $addFields: {
        weightedRating: { $multiply: ["$rating.mean", "$rating.count"] },
      },
    },
    {
      $sort: { weightedRating: -1, "rating.count": -1, "rating.mean": -1 },
    },
    {
      $skip: pagination?.skip ?? 0,
    },
    {
      $limit: pagination?.limit ?? 24,
    },
  ]).exec();
  if (places == null) throw new InternalError();
  return places.map((place): IPlaceExposed => toPlaceExposed(place));
};

export const getPlacesRatedByUser = async (
  user: string,
  pagination?: IPagination
): Promise<IPlaceExposedWithRatingAndFollow[]> => {
  const builder = new QueryBuilder();
  builder
    .pagination(pagination)
    .value("user", user)
    .order("updatedAt", OrderState.DECREASE);
  const ratings = await PlaceRating.find(builder.options)
    .populate<{ place: HydratedDocument<IPlaceSchema> }>("place")
    .sort(builder.sort)
    .skip(builder.skip)
    .limit(builder.limit)
    .exec();
  if (ratings == null) {
    throw new InternalError();
  }

  return ratings
    .filter((r) => r.place != null)
    .map((rating): IPlaceExposedWithRatingAndFollow => {
      const place = rating.place;
      return {
        ...toPlaceExposed(place),
        userRating: {
          place: place._id.toString(),
          score: rating.score,
          user: rating.user.toString(),
          createdAt: rating.createdAt,
          updatedAt: rating.updatedAt,
        },
      };
    });
};
