import { HydratedDocument } from "mongoose";
import { IUserFollower } from "./follower";
import { Ided, Named, Timed } from "./schemad";
import { IUserCredential, IUserPersonal } from "./user";
import { IUserSchema } from "~/db/model";

export interface IUserExposedSimple
  extends Ided,
    Named,
    Pick<IUserPersonal, "firstName" | "lastName" | "location" | "avatar">,
    Pick<IUserCredential, "email" | "active"> {}

export interface IUserExposed
  extends Ided,
    Named,
    IUserPersonal,
    Pick<Timed, "createdAt">,
    Pick<IUserCredential, "active" | "email"> {}

export interface IUserExposedFollower
  extends IUserFollower,
    Ided,
    Pick<Timed, "createdAt"> {}

export interface IUserExposedWithFollower extends IUserExposed {
  subcribers: number;
  userFollow?: IUserExposedFollower;
}

export const toUserExposedSimple = (
  user: HydratedDocument<IUserSchema>
): IUserExposedSimple => {
  return {
    _id: user._id.toString(),
    active: user.active,
    email: user.email,
    exposedName: user.exposedName,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    location: user.location,
  };
};

export const toUserExposed = (
  user: HydratedDocument<IUserSchema>,
  advance?: {
    description?: boolean;
  }
): IUserExposed => {
  const result: IUserExposed = {
    _id: user._id.toString(),
    active: user.active,
    createdAt: user.createdAt,
    email: user.email,
    exposedName: user.exposedName,
    firstName: user.firstName,
    lastName: user.lastName,
    avatar: user.avatar,
    categories: user.categories,
    location: user.location,
  };
  if (advance?.description) {
    result.description = user.description;
  }
  return result;
};
