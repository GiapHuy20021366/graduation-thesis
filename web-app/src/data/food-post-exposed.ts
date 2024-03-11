import { FoodCategory } from "./food-category";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";

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

export interface IFoodPostExposed {
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
  createdAt: string | Date;
  updatedAt: string | Date;
  likeCount: number;
  active: boolean;
}

export interface IFoodPostExposedWithLike extends IFoodPostExposed {
  liked?: boolean;
  like?: IFoodPostExposedLike;
}
