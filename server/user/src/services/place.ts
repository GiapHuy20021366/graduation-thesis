import { IPlaceSearchParams } from "~/data/place-search-params";
import {
  FollowRole,
  FollowType,
  IPlace,
  IPlaceAuthorExposed,
  IPlaceExposed,
  IPlaceFollower,
  IPlaceRating,
  IRating,
  InternalError,
  OrderState,
  ResourceNotExistedError,
  UnauthorizationError,
  toDistance,
} from "../data";
import { Follower, Place, PlaceRating } from "../db/model";

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
    ratingAfter,
  };
};

interface IPlaceInfo extends Omit<IPlaceExposed, "author"> {
  userRating?: IPlaceRating;
  userFollow?: IPlaceFollower;
  author: string | IPlaceAuthorExposed;
}

export const getPlaceInfo = async (placeId: string, userId?: string) => {
  const place = await Place.findById(placeId).populate<{
    author: IPlaceAuthorExposed;
  }>("author");
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
      };
    }
  }
  return result;
};
