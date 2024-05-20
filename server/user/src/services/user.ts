import { Follower, IPlaceSchema, IUserSchema, User } from "../db/model";
import {
  FollowRole,
  FollowType,
  IPersonalDataUpdate,
  IUserFollowerExposed,
  IUserSearchParams,
  InternalError,
  ResourceNotExistedError,
  IUserExposedSimple,
  IUserExposedWithFollower,
  IFollowerSearchParams,
  IFollowerExposed,
  IFollowerExposedUser,
  IFollowerExposedPlace,
  IFollowerExposedSubcriber,
  toUserExposed,
  toUserExposedSimple,
  QueryBuilder,
  IUserExposed,
} from "../data";
import { HydratedDocument, ObjectId } from "mongoose";

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
      ...toUserExposed(user, { description: true }),
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
    return toUserExposedSimple(user);
  }
};

const toUserSearchBuilder = (params: IUserSearchParams): QueryBuilder => {
  const { distance, order, pagination, query } = params;

  const builder = new QueryBuilder();
  builder.pagination(pagination);

  if (query) {
    const regex = new RegExp(query, "i");
    builder.value("$or", [
      { firstName: { $regex: regex } },
      { lastName: { $regex: regex } },
    ]);
  }
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

  builder
    .order("location.two_array", order?.distance)
    .order("createdAt", order?.time);

  return builder;
};

export const searchUser = async (
  params: IUserSearchParams
): Promise<IUserExposed[]> => {
  const buider = toUserSearchBuilder(params);

  const users = await User.find(buider.options)
    .sort(buider.sort)
    .skip(buider.skip)
    .limit(buider.limit);

  if (users == null) {
    throw new InternalError();
  }

  return users
    .filter((user) => user.location && user.location.name)
    .map((user): IUserExposed => toUserExposed(user));
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
): Promise<IUserExposedSimple> => {
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
  return toUserExposedSimple(user);
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
    exposedName: place.exposedName,
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

  const builder = new QueryBuilder();
  builder
    .pagination(pagination)
    .minMax("createdAt", {
      min: duration?.from,
      max: duration?.to,
    })
    .incAndExc("place", place)
    .incAndExc("subcriber", subcriber)
    .incAndExc("user", user)
    .array("role", role)
    .array("type", type)
    .order("createdAt", order?.time);

  const query = Follower.find(builder.options);
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
    .sort(builder.sort)
    .skip(builder.skip)
    .limit(builder.limit)
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
        place: toPlace(populates, place)!,
      };
    });
};
