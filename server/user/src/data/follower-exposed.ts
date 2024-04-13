import { IPlaceExposed } from "./place-exposed";
import { Ided, Schemad, toId } from "./schemad";
import { FollowRole, IFollowerBase } from "./follower";
import { HydratedDocument, ObjectId } from "mongoose";
import { IFollowerSchema } from "~/db/model";

export interface IFollowerExposedTarget {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  active: boolean;
}

export interface IFollowerExposedSubcriber extends IFollowerExposedTarget {}

export interface IFollowerExposedUser extends IFollowerExposedTarget {}

export interface IFollowerExposedPlace extends IPlaceExposed {}

export interface IFollowerBaseExposed
  extends Omit<IFollowerBase, "subcriber">,
    Schemad {
  subcriber: string | IFollowerExposedSubcriber;
}

export interface IPlaceFollowerExposed extends IFollowerBaseExposed {
  place: string | IFollowerExposedPlace;
}

export interface IUserFollowerExposed extends IFollowerBaseExposed {
  user: string | IFollowerExposedUser;
}

export type IFollowerExposed = IPlaceFollowerExposed | IUserFollowerExposed;

export const isUserFollower = (
  value: IFollowerExposed
): value is IUserFollowerExposed => {
  return value.role === FollowRole.USER;
};

export const isPlaceFollower = (
  value: IFollowerExposed
): value is IPlaceFollowerExposed => {
  return value.role === FollowRole.PLACE;
};

export const toFollowerExposed = (
  follower: HydratedDocument<
    Omit<IFollowerSchema, "place" | "user" | "subcriber"> & {
      place?: ObjectId | Ided;
      user?: ObjectId | Ided;
      subcriber: ObjectId | Ided;
    }
  >,
  meta?: {
    place?: IFollowerExposedPlace;
    user?: IFollowerExposedUser;
    subcriber?: IFollowerExposedSubcriber;
  }
): IFollowerExposed => {
  const { place, user, subcriber } = meta ?? {};
  return {
    _id: follower._id.toString(),
    createdAt: follower.createdAt,
    place: place ?? (follower.place && toId(follower.place))!,
    user: user ?? (follower.user && toId(follower.user))!,
    subcriber: subcriber ?? (follower.subcriber && toId(follower.subcriber))!,
    role: follower.role,
    type: follower.type,
    updatedAt: follower.updatedAt,
  }!;
};
