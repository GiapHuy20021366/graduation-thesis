import { IPlaceExposed } from ".";
import { FollowType } from "./user-place-follower";

export interface IPlaceFollowerExposedSubcriber {
  _id: string;
  firstName: string;
  lastName: string;
  avartar?: string;
}

export interface IPlaceFollowerExposedPlace extends IPlaceExposed {}

export interface IPlaceFollowerExposed {
  _id: string;
  type: FollowType;
  createdAt: string | number;
  updatedAt: string | number;
  subcriber: IPlaceFollowerExposedSubcriber;
  place?: string | IPlaceFollowerExposedPlace;
}
