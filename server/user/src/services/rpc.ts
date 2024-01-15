import { User } from "../db/model";

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
