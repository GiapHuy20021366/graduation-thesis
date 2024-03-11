import { Follower, User } from "../db/model";
import {
  FollowRole,
  FollowType,
  ICoordinates,
  IPagination,
  IUserFollowerExposed,
  IUserSearchParams,
  Ided,
  InternalError,
  ResourceNotExistedError,
} from "../data";
import { IUserCredential, IUserPersonal } from "~/data/user";

export interface ISearchedUser
  extends Ided,
    Pick<IUserCredential, "email">,
    Pick<
      IUserPersonal,
      "firstName" | "lastName" | "location" | "avatar" | "exposedName"
    > {}

export const searchUsersAround = async (params: {
  maxDistance: number;
  location: ICoordinates;
  pagination: IPagination;
}): Promise<ISearchedUser[]> => {
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
  const result: ISearchedUser[] = [];
  users.forEach((user) => {
    if (user.location != null && user.location.name) {
      result.push({
        _id: user._id.toString(),
        avatar: user.avatar,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        exposedName: user.exposedName,
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
    _id: user._id.toString(),
    avatar: user.avatar,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    location: user.location,
  };
};

export const searchUser = async (
  params: IUserSearchParams
): Promise<ISearchedUser[]> => {
  const { distance, order, pagination, query } = params;

  const options: any = {};
  const orderOptions: any = {};

  if (distance) {
    const { current, max } = distance;
    options["location.two_array"] = {
      $geoWithin: {
        $centerSphere: [[current.lng, current.lat], max / 6378.1],
      },
    };
  }

  if (query) {
    const regex = new RegExp(query, "i");
    options.$or = [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ];
  }

  if (order) {
    const { distance, time } = order;
    if (distance) {
      orderOptions.distance = distance;
    }
    if (time) {
      orderOptions.createdAt = time;
    }
  }

  const users = await User.find(options)
    .sort(orderOptions)
    .skip(pagination?.skip ?? 0)
    .limit(pagination?.limit ?? 24);

  if (users == null) {
    throw new InternalError();
  }

  return users
    .filter((user) => user.location && user.location.name)
    .map(
      (user): ISearchedUser => ({
        _id: user._id.toString(),
        avatar: user.avatar,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        location: user.location,
        exposedName: user.exposedName,
      })
    );
};

export const followUser = async (
  targetUser: string,
  sourceUser: string
): Promise<IUserFollowerExposed> => {
  const follower = await Follower.findOne({
    role: FollowRole.PLACE,
    subcriber: sourceUser,
    user: targetUser,
  }).exec();
  if (follower == null) {
    const nFollower = new Follower({
      role: FollowRole.USER,
      type: FollowType.SUBCRIBER,
      user: targetUser,
      subcriber: sourceUser,
    });
    await nFollower.save();
    return {
      _id: nFollower._id.toString(),
      createdAt: nFollower.createdAt,
      updatedAt: nFollower.updatedAt,
      role: nFollower.role,
      subcriber: sourceUser,
      user: targetUser,
      type: nFollower.type,
    };
  } else {
    return {
      _id: follower._id.toString(),
      createdAt: follower.createdAt,
      role: follower.role,
      subcriber: sourceUser,
      user: targetUser,
      type: follower.type,
      updatedAt: follower.updatedAt,
    };
  }
};

export const unFollowUser = async (
  targetUser: string,
  sourceUser: string
): Promise<{ success: boolean }> => {
  const follower = await Follower.findOne({
    role: FollowRole.PLACE,
    subcriber: sourceUser,
    user: targetUser,
  }).exec();
  if (follower != null) {
    await follower.deleteOne();
  }
  return {
    success: true,
  };
};
