import { IPlaceExposed } from "./place-exposed";
import { Schemad } from "./schemad";
import { FollowRole, IFollowerBase } from "./user-place-follower";

export interface IFollowerExposedTarget {
  _id: string;
  firstName: string;
  lastName: string;
  avartar?: string;
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
