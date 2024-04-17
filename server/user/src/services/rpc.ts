import mongoose from "mongoose";
import {
  FollowRole,
  FollowType,
  IPagination,
  IUserPersonal,
  Ided,
  InternalError,
} from "../data";
import { Follower, Place, PlaceRating, User } from "../db/model";

export interface RPCGetUserInfoReturn
  extends Ided,
    Pick<IUserPersonal, "firstName" | "lastName"> {}

export const rpcGetUserInfo = async (
  _id: string
): Promise<RPCGetUserInfoReturn | null> => {
  const user = await User.findById(_id).exec();
  if (user != null) {
    return {
      _id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }
  return null;
};

export const rpcGetUserById = async (
  _id: string,
  select?: string | string[]
) => {
  const query = User.findById(_id);
  if (select) {
    query.select(select);
  }
  return query.exec();
};

export const rpcGetDictUserByListId = async (
  _ids: string[],
  select?: string | string[]
) => {
  const result: Record<string, object> = {};
  if (_ids.length > 0) {
    const query = User.find({
      _id: {
        $in: _ids,
      },
    });
    if (select) {
      query.select(select);
    }
    const users = await query.exec();
    users.forEach((user) => {
      result[user._id.toString()] = user;
    });
  }
  return result;
};

export const rpcGetPlaceById = async (
  _id: string,
  select?: string | string[]
) => {
  const query = Place.findById(_id);
  if (select) {
    query.select(select);
  }
  return query.exec();
};

export const rpcGetDictPlaceByListId = async (
  _ids: string[],
  select?: string | string[]
) => {
  const result: Record<string, object> = {};
  if (_ids.length > 0) {
    const query = Place.find({
      _id: {
        $in: _ids,
      },
    });
    if (select) {
      query.select(select);
    }
    const places = await query.exec();
    places.forEach((place) => {
      result[place._id.toString()] = place;
    });
  }
  return result;
};

export interface IUserCachedRegisterData {
  _id: string;
  time: Date;
}

export interface IUserCachedRegister {
  users: IUserCachedRegisterData[];
  places: IUserCachedRegisterData[];
}

// Get users and places that this user follow
export const rpcGetRegistersByUserId = async (
  userId: string
): Promise<IUserCachedRegister> => {
  const follows = await Follower.find({
    subcriber: userId,
  });
  const result: IUserCachedRegister = {
    users: [],
    places: [],
  };
  follows.forEach((f) => {
    const type = f.type;
    const role = f.role;
    if (type === FollowType.SUBCRIBER) {
      switch (role) {
        case FollowRole.USER: {
          result.users.push({
            _id: f.user.toString(),
            time: f.updatedAt,
          });
          break;
        }
        case FollowRole.PLACE: {
          result.users.push({
            _id: f.place.toString(),
            time: f.updatedAt,
          });
          break;
        }
      }
    }
  });

  return result;
};

export interface IUserCachedFavoriteScore {
  category: string;
  score: number;
}

// Get categories with score from rated place
export const rpcGetRatedScoresByUserId = async (
  userId: string
): Promise<IUserCachedFavoriteScore[]> => {
  const datas = await PlaceRating.aggregate<{
    _id: string;
    count: number;
  }>([
    {
      $match: {
        user: new mongoose.Types.ObjectId(userId),
        score: { $gt: 3 },
      },
    },
    {
      $lookup: {
        from: "places",
        localField: "place",
        foreignField: "_id",
        as: "place",
      },
    },
    {
      $unwind: "$place",
    },
    {
      $unwind: "$place.categories",
    },
    {
      $group: {
        _id: "$place.categories",
        count: { $sum: 1 },
      },
    },
    {
      $sort: { count: -1 },
    },
  ]).exec();

  return datas.map((d) => ({ category: d._id, score: d.count }));
};

export const rpcGetUserSubcribersByUserId = async (
  userId: string,
  pagination: IPagination
): Promise<string[]> => {
  const followers = await Follower.find({
    role: FollowRole.USER,
    user: userId,
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .exec();

  if (followers == null) throw new InternalError();
  return followers.map((f) => f.subcriber.toString());
};

export const rpcGetPlaceSubcribersByPlaceId = async (
  placeId: string,
  pagination: IPagination
): Promise<string[]> => {
  const followers = await Follower.find({
    role: FollowRole.PLACE,
    place: placeId,
  })
    .skip(pagination.skip)
    .limit(pagination.limit)
    .exec();

  if (followers == null) throw new InternalError();
  return followers.map((f) => f.subcriber.toString());
};
