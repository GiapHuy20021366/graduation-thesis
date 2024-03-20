import { Follower, IPlaceSchema, IUserSchema, User } from "../db/model";
import {
  FollowRole,
  FollowType,
  ICoordinates,
  IPagination,
  IPersonalDataUpdate,
  IUserFollowerExposed,
  IUserSearchParams,
  Ided,
  InternalError,
  ResourceNotExistedError,
  IUserCredential,
  IUserPersonal,
  IUserExposedSimple,
  IUserExposedWithFollower,
  IFollowerSearchParams,
  IFollowerExposed,
  toIncludeAndExcludeQueryOptions,
  OrderState,
  IFollowerExposedUser,
  IFollowerExposedPlace,
  IFollowerExposedSubcriber,
} from "../data";
import { HydratedDocument, ObjectId } from "mongoose";

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

export const getUser = async (
  id: string,
  sourceId: string,
  detail?: boolean
): Promise<IUserExposedSimple | IUserExposedWithFollower> => {
  const user = await User.findById(id);
  if (user == null) {
    throw new ResourceNotExistedError();
  }

  if (detail) {
    const numFollowers = await Follower.count({
      type: FollowType.SUBCRIBER,
      role: FollowRole.USER,
      user: id,
    });
    const userFollower = await Follower.findOne({
      type: FollowType.SUBCRIBER,
      role: FollowRole.USER,
      user: id,
      subcriber: sourceId, // does this user follow this user or not
    });
    const result: IUserExposedWithFollower = {
      _id: user._id.toString(),
      active: user.active,
      createdAt: user.createdAt,
      email: user.email,
      exposedName: user.exposedName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      categories: user.categories,
      description: user.description,
      location: user.location,
      subcribers: numFollowers,
    };
    if (userFollower) {
      result.userFollow = {
        _id: userFollower._id.toString(),
        createdAt: userFollower.createdAt,
        role: userFollower.role,
        subcriber: userFollower.subcriber.toString(),
        type: userFollower.type,
        user: userFollower.user.toString(),
      };
    }
    return result;
  } else {
    const result: IUserExposedSimple = {
      _id: user._id.toString(),
      active: user.active,
      email: user.email,
      exposedName: user.exposedName,
      firstName: user.firstName,
      lastName: user.lastName,
      avatar: user.avatar,
      location: user.location,
    };
    return result;
  }
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

export const updateUserPersonal = async (
  userId: string,
  data: IPersonalDataUpdate
): Promise<{ success: boolean }> => {
  const user = await User.findById(userId);
  if (user == null) {
    throw new ResourceNotExistedError({
      message: `No user with id ${user} found`,
      data: {
        target: "id",
        reason: "not-found",
      },
    });
  }
  const { updated, deleted } = data;

  if (updated) {
    const {
      exposedName,
      firstName,
      lastName,
      avatar,
      categories,
      description,
      location,
    } = updated;
    if (updated.avatar) {
      user.avatar = avatar;
    }
    if (exposedName) {
      user.exposedName = exposedName;
    }
    if (firstName) {
      user.firstName = firstName;
    }
    if (lastName) {
      user.lastName = lastName;
    }
    if (categories) {
      user.categories = categories;
    }
    if (description) {
      user.description = description;
    }
    if (location) {
      user.location = {
        ...location,
        two_array: [location.coordinates.lng, location.coordinates.lat],
      };
    }
  }
  if (deleted) {
    const { avatar, categories, description, location } = deleted;
    if (avatar) {
      user.avatar = undefined;
    }
    if (categories) {
      user.categories = [];
    }
    if (description) {
      user.description = undefined;
    }
    if (location) {
      user.location = undefined;
    }
  }
  user.updatedAt = new Date();
  await user.save();
  return { success: true };
};

const toSubcriber = (
  populates: string[],
  data: any
): string | IFollowerExposedSubcriber => {
  if (!populates.includes("subcriber")) {
    const datas = <ObjectId>data;
    return datas.toString();
  }
  const subcriber = <HydratedDocument<IUserSchema>>data;
  return {
    _id: subcriber._id.toString(),
    firstName: subcriber.firstName,
    lastName: subcriber.lastName,
    avatar: subcriber.avatar,
    active: subcriber.active,
  };
};

const toUser = (
  populates: string[],
  data: any
): string | IFollowerExposedUser | undefined => {
  if (data == null) return;
  if (!populates.includes("user")) {
    const datas = <ObjectId>data;
    return datas.toString();
  }
  const user = <HydratedDocument<IUserSchema>>data;
  return {
    _id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    active: user.active,
  };
};

const toPlace = (
  populates: string[],
  data: any
): string | IFollowerExposedPlace | undefined => {
  if (data == null) return;
  if (!populates.includes("place")) {
    const datas = <ObjectId>data;
    return datas.toString();
  }
  const place = <HydratedDocument<IPlaceSchema>>data;
  return {
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
    avatar: place.avatar,
  };
};
export const getFollowers = async (
  params: IFollowerSearchParams
): Promise<IFollowerExposed[]> => {
  const {
    duration,
    order,
    pagination,
    place,
    role,
    subcriber,
    type,
    user,
    populate,
  } = params;

  const options: any = {};
  if (duration != null) {
    const { from, to } = duration;
    const createdAtOptions: any = {};
    if (from != null) {
      createdAtOptions.$gte = from;
    }
    if (to != null) {
      createdAtOptions.$lte = to;
    }
    if (from != null || to != null) {
      options["createdAt"] = createdAtOptions;
    }
  }

  const placeOptions = toIncludeAndExcludeQueryOptions(place);
  if (placeOptions != null) {
    options["place"] = placeOptions;
  }

  const subcriberOptions = toIncludeAndExcludeQueryOptions(subcriber);
  if (subcriberOptions != null) {
    options["subcriber"] = subcriberOptions;
  }

  const userOptions = toIncludeAndExcludeQueryOptions(user);
  if (userOptions != null) {
    options["user"] = userOptions;
  }

  if (role != null) {
    if (role.length === 1) {
      options["role"] = role[0];
    } else {
      options["role"] = { $in: role };
    }
  }

  if (type != null) {
    if (type.length === 1) {
      options["type"] = type[0];
    } else {
      options["type"] = { $in: type };
    }
  }

  const sort: any = {};
  if (order != null) {
    const { time } = order;
    if (time != null && time !== OrderState.NONE) {
      sort["createdAt"] = time;
    }
  }

  const query = Follower.find(options);
  const populates: string[] = [];
  if (populate != null && Object.keys(populate).length > 0) {
    if (populate.place) populates.push("place");
    if (populate.user) populates.push("user");
    if (populate.subcriber) populates.push("subcriber");
    query.populate<{
      user?: IFollowerExposedUser;
      place?: IFollowerExposedPlace;
      subcriber: IFollowerExposedSubcriber;
    }>(populates.join(""));
  }

  const followers = await query
    .sort(sort)
    .skip(pagination?.skip ?? 0)
    .limit(pagination?.limit ?? 24)
    .exec();

  if (followers == null) throw new InternalError();

  return followers
    .filter((f) => {
      if (f.subcriber == null) return false;
      if (f.role === FollowRole.PLACE && f.place == null) return false;
      if (f.role === FollowRole.USER && f.user == null) return false;
      return true;
    })
    .map((f): IFollowerExposed => {
      const subcriber = f.subcriber;
      const user = f.user;
      const place = f.place;
      return {
        _id: f._id.toString(),
        createdAt: f.createdAt,
        subcriber: toSubcriber(populates, subcriber),
        role: f.role,
        type: f.type,
        updatedAt: f.updatedAt,
        user: toUser(populates, user)!,
        place: toPlace(populates, place)!
      };
    });
};
