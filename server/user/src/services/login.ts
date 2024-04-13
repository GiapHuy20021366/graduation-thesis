import {
  ResourceNotExistedError,
  UnauthorizationError,
  IAccountExposed,
  toAccountExposed,
} from "../data";
import { User } from "../db/model";
import { compareHash } from "../utils";

export const loginAccountByManual = async (
  email: string,
  password: string
): Promise<IAccountExposed> => {
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

  return toAccountExposed(user);
};
