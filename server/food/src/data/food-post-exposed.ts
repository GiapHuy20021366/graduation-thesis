import { IFoodPostSchema } from "../db/model";
import { IFoodPostLocation } from "./food-post";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IFoodPostExposedUser {
  _id: string;
  firstName: string;
  lastName: string;
  avartar?: string;
  location?: IFoodPostLocation;
}

export interface IFoodPostExposedPlace {
  _id: string;
  exposeName: string;
  avartar?: string;
  type: PlaceType;
  location: ILocation;
}

export interface IFoodPostExposed
  extends Omit<IFoodPostSchema, "user" | "place"> {
  _id: string;
  user: string | IFoodPostExposedUser;
  place?: string | IFoodPostExposedPlace;
}
