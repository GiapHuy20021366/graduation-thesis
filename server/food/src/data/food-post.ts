import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IFoodPostLocation extends ILocation {
  two_array?: number[];
}

export interface IFoodPostPlace {
  _id: string;
  type: PlaceType;
}

export interface IFoodPost {
  user: string;
  place?: IFoodPostPlace;
  images: string[];
  title: string;
  location: IFoodPostLocation;
  categories: string[];
  description: string;
  quantity: number;
  duration: Date;
  price: number;
}
