import {
  IAccountExposed,
  GoogleOAuthInfo,
  InternalError,
  InvalidDataError,
  ResourceExistedError,
  toAccountExposed,
} from "../data";
import { IUserSchema, User } from "../db/model";
import { BrokerSource, RabbitMQ, brokerOperations } from "../broker";
import {
  generateRandomPassword,
  hashText,
  signToken,
  verifyToken,
} from "../utils";
import { jwtDecode } from "jwt-decode";
import { HydratedDocument } from "mongoose";

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

  // send email to user
  RabbitMQ.instance.publicMessage(
    BrokerSource.MESSAGE,
    brokerOperations.mail.ACTIVE_MANUAL_ACCOUNT,
    {
      email: info.email,
      token: token,
    }
  );

  return {
    isSuccessful: true,
  };
};

export const createManualAccountFromToken = async (
  token: string
): Promise<IAccountExposed> => {
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

  return toAccountExposed(newAccount);
};

export const registAccountByGoogleCridential = async (
  cridential: string
): Promise<IAccountExposed> => {
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

  let responseUser: HydratedDocument<IUserSchema> | undefined;
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
    const newUser: IUserSchema = {
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
      categories: [],
      active: true,
      exposedName: "",
    };
    const user = new User(newUser);
    await user.save();

    // send when new account created
    RabbitMQ.instance.publicMessage(
      BrokerSource.MESSAGE,
      brokerOperations.mail.NEW_ACCOUNT_CREATED,
      {
        email: email,
        password: genPassword,
      }
    );

    responseUser = user;
  }

  return toAccountExposed(responseUser);
};
