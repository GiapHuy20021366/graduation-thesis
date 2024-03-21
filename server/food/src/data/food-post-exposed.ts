import { IFoodPostSchema } from "../db/model";
import { IFoodPostLocation } from "./food-post";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";
import { Ided, Named, Timed } from "./schemad";

export interface IFoodPostExposedUser extends Ided {
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: IFoodPostLocation;
}

export interface IFoodPostExposedPlace extends Ided, Named {
  avatar?: string;
  type: PlaceType;
  location: ILocation;
}

export interface IFoodPostExposedLike extends Ided, Pick<Timed, "createdAt"> {
  user: string;
  foodPost: string;
}

export interface IFoodPostExposed
  extends Omit<IFoodPostSchema, "user" | "place">,
    Ided {
  user: string | IFoodPostExposedUser;
  place?: string | IFoodPostExposedPlace;
  like?: IFoodPostExposedLike;
}
