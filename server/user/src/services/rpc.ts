import { Place, User } from "../db/model";

export interface RPCGetUserInfoReturn {
  _id: string;
  firstName: string;
  lastName: string;
}

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
      result[user._id] = user;
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
