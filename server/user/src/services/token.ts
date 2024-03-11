import { User } from "../db/model";
import {
  AccountExposed,
  AuthLike,
  ResourceNotExistedError,
  toAuthToken,
} from "../data";

export const refreshToken = async (
  auth: AuthLike,
  profile?: boolean
): Promise<AccountExposed> => {
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
    return {
      _id: user._id.toString(),
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      token: toAuthToken({
        email: user.email,
        _id: user._id.toString(),
      }),
      avatar: user.avatar,
      location: user.location,
      active: user.active,
      exposedName: user.exposedName,
    };
  } else {
    return {
      _id: auth._id,
      token: toAuthToken(auth),
    };
  }
};
