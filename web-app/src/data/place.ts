import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IPlace {
  exposedName: string;
  description?: string;
  categories: string[];
  location: ILocation;
  avatar?: string;
  images: string[];
  type: PlaceType;
}
