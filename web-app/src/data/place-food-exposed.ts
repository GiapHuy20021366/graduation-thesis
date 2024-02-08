import { FoodCategory } from ".";
import { ILocation } from "./location";

export interface IPlaceFoodExposedPlace {
  _id: string;
  location: ILocation;
  exposedName: string;
}

export interface IPlaceFoodExposedFood {
  _id: string;
  title: string;
  categories?: FoodCategory[];
  time: number | string; // updatedAt: time
  duration: number | string;
  images: string[];
}

export interface IPlaceFoodExposedAuthor {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
}

export interface IPlaceFoodExposed {
  place: IPlaceFoodExposedPlace;
  food: IPlaceFoodExposedFood;
  author: IPlaceFoodExposedAuthor;
}
