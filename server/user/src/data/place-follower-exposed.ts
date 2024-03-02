import { IPlaceExposed } from "./place-exposed";
import { IPlaceFollower } from "./user-place-follower";

export interface IPlaceFollowerExposedSubcriber {
  _id: string;
  firstName: string;
  lastName: string;
  avartar?: string;
}

export interface IPlaceFollowerExposedPlace extends IPlaceExposed {}

export interface IPlaceFollowerExposed
  extends Omit<IPlaceFollower, "place" | "subcriber"> {
  _id: string;
  subcriber: string | IPlaceFollowerExposedSubcriber;
  place: string | IPlaceFollowerExposedPlace;
  createdAt: Date;
  updatedAt: Date;
}
