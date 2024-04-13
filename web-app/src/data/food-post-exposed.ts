import { FoodCategory } from "./food-category";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";
import { Actived, Timed } from "./schemad";

export interface IFoodPostExposedUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: ILocation;
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
  createdAt: string | Date;
  user: string;
  foodPost: string;
}

export interface IFoodResolved {
  resolved: boolean;
  resolveTime: Date;
  resolveBy: string;
}

export interface IFoodPostExposed
  extends Partial<IFoodResolved>,
    Actived,
    Timed {
  _id: string;
  user: string | IFoodPostExposedUser;
  place?: string | IFoodPostExposedPlace;
  images: string[];
  title: string;
  categories: FoodCategory[];
  description?: string;
  quantity: number;
  duration: string | Date;
  price: number;
  isEdited: boolean;
  likeCount: number;
  location: ILocation;
}

export interface IFoodPostExposedWithLike extends IFoodPostExposed {
  liked?: boolean;
  like?: IFoodPostExposedLike;
}
