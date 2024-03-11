import {
  ResourceNotExistedError,
  UnauthorizationError,
  toAuthToken,
  AccountExposed,
} from "../data";
import { User } from "../db/model";
import { compareHash } from "../utils";

export const loginAccountByManual = async (
  email: string,
  password: string
): Promise<AccountExposed> => {
  const user = await User.findOneByEmail(email);
  if (user == null) {
    throw new ResourceNotExistedError({
      message: `No account with email ${email} found`,
      data: {
        target: "email",
        reason: "no-email-found",
      },
    });
  }

  if (!compareHash(password, user.password)) {
    throw new UnauthorizationError({
      message: "Incorrect password",
      data: {
        target: "password",
        reason: "incorrect-password",
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
};
