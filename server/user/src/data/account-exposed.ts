import { HydratedDocument } from "mongoose";
import { Ided } from "./schemad";
import { IUserCredential, IUserPersonal } from "./user";
import { IUserSchema } from "../db/model";
import { toAuthToken } from "./to-auth-token";

export interface IAccountExposed
  extends Ided,
    Partial<Pick<IUserCredential, "active" | "email">>,
    Partial<
      Pick<
        IUserPersonal,
        "avatar" | "location" | "firstName" | "lastName" | "exposedName"
      >
    > {
  token: string;
}

export const toAccountExposed = (
  user: HydratedDocument<IUserSchema>
): IAccountExposed => {
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
