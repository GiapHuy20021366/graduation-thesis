import { FoodCategory } from "./food-category";
import { ILocation } from "./location";
import { IUserFollower } from "./user-place-follower";

export interface IUserExposed {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  email?: string;
  location?: ILocation;
  createdAt: string | Date;
  updatedAt?: string | Date;
  description?: string;
  categories: FoodCategory[];
  subcribers?: number;
}

export interface IUserExposedFollower extends IUserFollower {
  _id: string;
  createdAt: string | Date;
}

export interface IUserExposedWithFollower extends IUserExposed {
  userFollow?: IUserExposedFollower;
}
