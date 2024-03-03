import { IPlaceSearchParams } from "~/data/place-search-params";
import {
  FollowRole,
  FollowType,
  ICoordinates,
  IPagination,
  IPlace,
  IPlaceAuthorExposed,
  IPlaceExposed,
  IPlaceFollower,
  IPlaceFollowerExposed,
  IPlaceRating,
  IRating,
  InternalError,
  OrderState,
  PlaceType,
  ResourceNotExistedError,
  UnauthorizationError,
  toDistance,
} from "../data";
import { Follower, Place, PlaceRating, UserDocument } from "../db/model";

export interface IPlaceData extends Omit<IPlace, "author"> {}

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

  const result: IPlaceExposed = {
    _id: newPlace._id.toString(),
    active: newPlace.active,
    author: authorId,
    categories: newPlace.categories,
    createdAt: newPlace.createdAt,
    description: newPlace.description,
    exposeName: newPlace.exposeName,
    images: newPlace.images,
    location: newPlace.location,
    rating: newPlace.rating,
    type: newPlace.type,
    updatedAt: newPlace.updatedAt,
    avartar: newPlace.avartar,
  };
  return result;
};

export const updatePlace = async (
  newData: IPlaceData,
  placeId: string,
  userId: string
) => {
  const place = await Place.findById(placeId).populate<{
    author: IPlaceAuthorExposed;
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
  place.avartar = newData.avartar;
  place.updatedAt = new Date();

  await place.save();

  const result: IPlaceExposed = {
    _id: place._id.toString(),
    active: place.active,
    author: place.author._id,
    categories: place.categories,
    createdAt: place.createdAt,
    description: place.description,
    exposeName: place.exposeName,
    images: place.images,
    location: place.location,
    rating: place.rating,
    type: place.type,
    updatedAt: place.updatedAt,
    avartar: place.avartar,
  };
  return result;
};

export const activePlace = async (
  placeId: string,
  userId: string,
  active: boolean
) => {
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
) => {
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
    return newFollower;
  } else {
    if (follower.type !== followType) {
      follower.type = followType;
      follower.updatedAt = new Date();
      await follower.save();
      return follower;
    }
  }
};

export const unfollowPlace = async (placeId: string, userId: string) => {
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

  return { unfollow: true };
};

export const searchPlaces = async (params: IPlaceSearchParams) => {
  const {
    currentLocation,
    maxDistance,
    pagination,
    order,
    author,
    query: searchQuery,
    minRating,
    types,
  } = params;
  const options: any = {};
  const meta: any = {};
  const sort: any = {};

  if (searchQuery != null && searchQuery.length > 0) {
    options["$text"] = {
      $search: searchQuery,
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

  // Quantity
  if (minRating) {
    options["rating.mean"] = {
      $gte: minRating,
    };
  }

  // author
  if (author) {
    options["author"] = author;
  }

  if (types != null && types.length > 0) {
    options["type"] = {
      $in: types,
    };
  }

  // score final
  if (searchQuery != null && searchQuery.length > 0) {
    sort["score"] = {
      $meta: "textScore",
    };
    meta["score"] = {
      $meta: "textScore",
    };
  }

  if (order) {
    if (order.rating) {
      sort["rating.mean"] = order.rating;
    }
  }

  const query = Place.find(options, meta).sort(sort);

  // Pagination
  if (pagination) {
    query.skip(pagination.skip).limit(pagination.limit);
  }

  const result = await query.exec();
  if (result == null) throw new InternalError();

  // Sort follow location
  if (order) {
    if (currentLocation && order.distance) {
      result.sort((f1, f2) => {
        const pos1 = f1.location.coordinates;
        const pos2 = f2.location.coordinates;
        const delta =
          toDistance(pos1, currentLocation) - toDistance(pos2, currentLocation);
        if (order.distance === OrderState.INCREASE) return delta;
        return -delta;
      });
      sort["location.two_array"] = order.distance;
    }
  }
  return result;
};

export const ratingPlace = async (
  placeId: string,
  userId: string,
  score: number | undefined
) => {
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
    ...ratingAfter,
  };
};

interface IPlaceInfo extends Omit<IPlaceExposed, "author"> {
  userRating?: IPlaceRating & { time: number | string };
  userFollow?: IPlaceFollower & { time: number | string };
  author: string | IPlaceAuthorExposed;
}

export const getPlaceInfo = async (placeId: string, userId?: string) => {
  const place = await Place.findById(placeId).populate<{
    author: IPlaceAuthorExposed;
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
  const result: IPlaceInfo = {
    _id: place._id.toString(),
    active: place.active,
    author: place.author,
    categories: place.categories,
    createdAt: place.createdAt,
    exposeName: place.exposeName,
    images: place.images,
    location: place.location,
    rating: place.rating,
    type: place.type,
    updatedAt: place.updatedAt,
    avartar: place.avartar,
    description: place.description,
  };
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
        time: follower.updatedAt.getTime(),
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
        time: rating.updatedAt.getTime(),
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
): Promise<IPlaceInfo[]> => {
  const options: any = {
    subcriber: user,
    role: FollowRole.PLACE,
  };
  if (placeTypes != null) {
    options["place.type"] = {
      $in: placeTypes,
    };
  }
  if (followTypes != null) {
    options["type"] = {
      $in: followTypes,
    };
  }
  const followers = await Follower.find(options)
    .populate<{ place: IPlaceExposed; subcriber: string }>("place")
    .sort({
      createdAt: OrderState.DECREASE,
    })
    .skip(pagination?.skip ?? 0)
    .limit(pagination?.limit ?? 24)
    .exec();

  if (followers == null) {
    throw new InternalError();
  }

  return followers
    .filter((f) => f.place != null)
    .map((follower): IPlaceInfo => {
      return {
        _id: follower.place._id,
        active: follower.place.active,
        author: follower.place.author,
        categories: follower.place.categories,
        createdAt: follower.place.createdAt,
        exposeName: follower.place.exposeName,
        images: follower.place.images,
        location: follower.place.location,
        rating: follower.place.rating,
        type: follower.place.type,
        updatedAt: follower.place.updatedAt,
        avartar: follower.place.avartar,
        description: follower.place.description,
        subcribers: follower.place.subcribers,
        userFollow: {
          place: follower.place._id,
          role: follower.role,
          subcriber: follower.subcriber,
          time: follower.updatedAt.getTime(),
          type: follower.type,
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

  return places.map(
    (place): IPlaceInfo => ({
      _id: place._id.toString(),
      active: place.active,
      author: place.author.toString(),
      categories: place.categories,
      createdAt: place.createdAt,
      exposeName: place.exposeName,
      images: place.images,
      location: place.location,
      rating: place.rating,
      type: place.type,
      updatedAt: place.updatedAt,
      avartar: place.avartar,
      description: place.description,
    })
  );
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
  return places.map(
    (place): IPlaceInfo => ({
      _id: place._id.toString(),
      active: place.active,
      author: place.author.toString(),
      categories: place.categories,
      createdAt: place.createdAt,
      exposeName: place.exposeName,
      images: place.images,
      location: place.location,
      rating: place.rating,
      type: place.type,
      updatedAt: place.updatedAt,
      avartar: place.avartar,
      description: place.description,
    })
  );
};

export const getPlacesRatedByUser = async (
  user: string,
  pagination?: IPagination
): Promise<IPlaceInfo[]> => {
  const ratings = await PlaceRating.find({
    user: user,
  })
    .populate<{ place: IPlaceExposed }>("place")
    .sort({
      updatedAt: OrderState.DECREASE,
    })
    .skip(pagination?.skip ?? 0)
    .limit(pagination?.limit ?? 24)
    .exec();
  if (ratings == null) {
    throw new InternalError();
  }

  return ratings
    .filter((r) => r.place != null)
    .map((rating): IPlaceInfo => {
      const place = rating.place;
      return {
        _id: place._id,
        active: place.active,
        author: place.author,
        categories: place.categories,
        createdAt: place.createdAt,
        exposeName: place.exposeName,
        images: place.images,
        location: place.location,
        rating: place.rating,
        type: place.type,
        updatedAt: place.updatedAt,
        avartar: place.avartar,
        description: place.description,
        userRating: {
          place: place._id,
          score: rating.score,
          time: rating.updatedAt.getTime(),
          user: rating.user.toString(),
        },
      };
    });
};

export interface IGetPlaceFollowersParams {
  include?: string[]; // include users
  exclude?: string[]; // exclude users
  followTypes?: FollowType[];
  pagination?: IPagination;
}

export const getPlaceFollowers = async (
  place: string,
  params: IGetPlaceFollowersParams
): Promise<IPlaceFollowerExposed[]> => {
  const options: any = {};
  options.role = FollowRole.PLACE;
  options.place = place;

  const { exclude, followTypes, include, pagination } = params;

  const subciberOption: any = {};
  if (exclude && exclude.length > 0) {
    subciberOption.$nin = exclude;
  }
  if (include && include.length > 0) {
    subciberOption.$in = include;
  }
  if (Object.keys(subciberOption).length > 0) {
    options["subcriber"] = subciberOption;
  }
  if (followTypes && followTypes.length > 0) {
    options.type = {
      $in: followTypes,
    };
  }

  const followers = await Follower.find(options)
    .populate<{
      subcriber: UserDocument;
      place: string;
    }>("subcriber")
    .sort({
      updatedAt: OrderState.DECREASE,
    })
    .skip(pagination?.skip ?? 0)
    .limit(pagination?.limit ?? 24)
    .exec();

  if (followers == null) {
    throw new InternalError();
  }
  return followers.map((follower): IPlaceFollowerExposed => {
    const subcriber = follower.subcriber;
    return {
      _id: follower._id.toString(),
      createdAt: follower.createdAt,
      updatedAt: follower.updatedAt,
      place: follower.place,
      role: follower.role,
      subcriber: {
        _id: subcriber._id,
        firstName: subcriber.firstName,
        lastName: subcriber.lastName,
        avartar: subcriber.avatar,
      },
      type: follower.type,
    };
  });
};
