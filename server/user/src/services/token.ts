import { User } from "../db/model";
import {
  IAccountExposed,
  AuthLike,
  ResourceNotExistedError,
  toAuthToken,
  toAccountExposed,
} from "../data";

export const refreshToken = async (
  auth: AuthLike,
  profile?: boolean
): Promise<IAccountExposed> => {
  if (profile) {
    const user = await User.findOneByEmail(auth.email);
    if (user == null) {
      throw new ResourceNotExistedError({
        message: "User not existed",
        data: {
          target: "user",
          reason: "no-user-found",
        },
      });
    }
    return toAccountExposed(user);
  } else {
    return {
      _id: auth._id,
      token: toAuthToken(auth),
    };
  }
};
