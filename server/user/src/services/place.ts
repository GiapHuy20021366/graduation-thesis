import {
  FollowRole,
  FollowType,
  IPlace,
  IPlaceAuthorExposed,
  IPlaceExposed,
  ResourceNotExistedError,
  UnauthorizationError,
} from "~/data";
import { Follower, Place } from "../db/model";

interface IPlaceData extends IPlace {}
export const createNewPlace = async (data: IPlaceData, authorId: string) => {
  const dataToCreate = { ...data };
  const coordinates = data.location.coordinates;
  dataToCreate.location.two_array = [coordinates.lng, coordinates.lat];

  const newPlace = new Place(dataToCreate);
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
  followType: number
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

// user find places

// user report place

// user voting place
