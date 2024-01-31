import { User } from "../db/model";
import {
  ICoordinates,
  ILocation,
  IPagination,
  InternalError,
  ResourceNotExistedError,
} from "../data";

interface SearchedUser {
  id_: string;
  firstName: string;
  lastName: string;
  avartar: string;
  email: string;
  location: ILocation;
}

export const searchUsersAround = async (params: {
  maxDistance: number;
  location: ICoordinates;
  pagination: IPagination;
}): Promise<SearchedUser[]> => {
  const { location, maxDistance, pagination } = params;
  const users = await User.find({
    "location.two_array": {
      $geoWithin: {
        $centerSphere: [[location.lng, location.lat], maxDistance / 6378.1],
      },
    },
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .exec();

  if (users == null) {
    throw new InternalError({
      message: "Can not find users in database",
      data: {
        target: "database",
        reason: "unknown",
      },
    });
  }
  const result: SearchedUser[] = [];
  users.forEach((user) => {
    if (user.location != null) {
      result.push({
        id_: user._id.toString(),
        avartar: user.avatar,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
      });
    }
  });
  return result;
};

export const getBasicUserInfo = async (id: string) => {
  const user = await User.findById(id);
  if (user == null) {
    throw new ResourceNotExistedError({
      message: `No user with id ${id} found`,
      data: {
        target: "user",
        reason: "no-user-found",
      },
    });
  }

  return {
    id_: user._id.toString(),
    avartar: user.avatar,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
  };
};
