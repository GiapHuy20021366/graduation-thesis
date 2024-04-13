import { ILocation } from "./location";
import { PlaceType } from "./place-type";
import { Ided } from "./schemad";

export interface IFoodPostLocation extends ILocation {
  two_array?: number[];
}

export interface IFoodPostPlace extends Ided {
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

export interface IPostFoodData extends Omit<IFoodPost, "place"> {
  place?: string;
}
