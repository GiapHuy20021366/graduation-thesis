import { IFoodPostSchema } from "../db/model";
import { IFoodPostLocation } from "./food-post";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IFoodPostExposedUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: IFoodPostLocation;
}

export interface IFoodPostExposedPlace {
  _id: string;
  exposeName: string;
  avatar?: string;
  type: PlaceType;
  location: ILocation;
}

export interface IFoodPostExposedLike {
  _id: string;
  user: string;
  createdAt: string | Date;
  foodPost: string;
}

export interface IFoodPostExposed
  extends Omit<IFoodPostSchema, "user" | "place"> {
  _id: string;
  user: string | IFoodPostExposedUser;
  place?: string | IFoodPostExposedPlace;
  like?: IFoodPostExposedLike;
}
