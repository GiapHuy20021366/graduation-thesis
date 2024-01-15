import {
  AccountExposed,
  GoogleOAuthInfo,
  InternalError,
  InvalidDataError,
  ResourceExistedError,
  UserInfo,
} from "../data";
import { User } from "../db/model";
import { USER_SERVICE } from "../config";
import { operations, brokerChannel } from "../broker";
import {
  generateRandomPassword,
  hashText,
  signToken,
  verifyToken,
} from "../utils";
import { toAuthToken } from "../data";
import { jwtDecode } from "jwt-decode";

interface ManualAccountRegisterInfo {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export const registAccountByManual = async (
  info: ManualAccountRegisterInfo
): Promise<any> => {
  const account = await User.findOneByEmail(info.email);
  if (account !== null) {
    throw new ResourceExistedError({
      message: "Email already existed",
      data: {
        target: "email",
        reason: "email-existed",
      },
    });
  }

  const token = signToken(
    {
      ...info,
      password: hashText(info.password),
    },
    "1h"
  );
  const message = JSON.stringify({
    email: info.email,
    operation: operations.mail.ACTIVE_MANUAL_ACCOUNT,
    token: token,
    from: USER_SERVICE,
  });

  // send email to user
  brokerChannel.toMessageServiceQueue(message);

  return {
    isSuccessful: true,
  };
};

export const createManualAccountFromToken = async (
  token: string
): Promise<AccountExposed> => {
  const info = verifyToken(token) as {
    data: ManualAccountRegisterInfo;
  } | null;
  if (info === null) {
    throw new InvalidDataError({
      message: "Token invalid",
      data: {
        target: "token",
        reason: "invalid-token",
      },
    });
  }

  const { email, firstName, lastName, password } = info.data;

  const account = await User.findOneByEmail(email);
  if (account !== null) {
    throw new ResourceExistedError({
      message: "Email already existed",
      data: {
        target: "email",
        reason: "email-existed",
      },
    });
  }

  const newAccount = await User.create({
    firstName,
    lastName,
    email,
    password,
  });

  return {
    id_: newAccount._id.toString(),
    firstName: newAccount.firstName,
    lastName: newAccount.lastName,
    email: newAccount.email,
    avatar: newAccount.avatar,
    titles: newAccount.titles,
    token: toAuthToken({
      email: newAccount.email,
      _id: newAccount._id.toString(),
    }),
  };
};

export const registAccountByGoogleCridential = async (
  cridential: string
): Promise<AccountExposed> => {
  let googleOAuth: GoogleOAuthInfo | undefined;
  try {
    googleOAuth = jwtDecode(cridential) as GoogleOAuthInfo;
  } catch (error) {
    throw new InvalidDataError({
      message: "Invalid cridential",
      data: {
        target: "credential",
        reason: "invalid-credential",
      },
    });
  }
  const { email } = googleOAuth;
  const user = await User.findOneByEmail(email);

  let responseUser: UserInfo | undefined;
  const newDate = new Date();
  if (user != null) {
    // update information
    const createdAt = user.googleOAuth?.createdAt;
    const updated: GoogleOAuthInfo = {
      ...user.googleOAuth,
      ...googleOAuth,
      updatedAt: newDate,
      createdAt: createdAt ?? newDate,
    };
    user.googleOAuth = updated;
    user.firstName ??= googleOAuth.given_name || "";
    user.lastName ??= googleOAuth.family_name || "";
    user.avatar ??= googleOAuth.picture;
    user.updatedAt = newDate;
    await user.save();
    responseUser = user;
  } else {
    const genPassword = generateRandomPassword();
    const password = hashText(genPassword);
    if (password == null) {
      throw new InternalError({
        message: "Internal server error",
      });
    }
    const newUser: UserInfo = {
      googleOAuth: {
        ...googleOAuth,
        createdAt: newDate,
        updatedAt: newDate,
      },
      avatar: googleOAuth.picture,
      email: googleOAuth.email,
      firstName: googleOAuth.given_name,
      lastName: googleOAuth.family_name,
      createdAt: newDate,
      updatedAt: newDate,
      validSince: newDate,
      password: password,
      titles: [],
    };
    const user = new User(newUser);
    await user.save();

    // send when new account created
    const message = JSON.stringify({
      email: email,
      operation: operations.mail.NEW_ACCOUNT_CREATED,
      password: genPassword,
      from: USER_SERVICE,
    });
    brokerChannel.toMessageServiceQueue(message);

    responseUser = user;
  }

  return {
    id_: user!._id.toString(),
    firstName: responseUser.firstName,
    lastName: responseUser.lastName,
    email: responseUser.email,
    avatar: responseUser.avatar,
    titles: responseUser.titles,
    token: toAuthToken({
      email: responseUser.email,
      _id: user!._id.toString(),
    }),
  };
};
