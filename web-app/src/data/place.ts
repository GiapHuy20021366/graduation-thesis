import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IPlace {
  exposeName: string;
  description?: string;
  categories: string[];
  location: ILocation;
  avartar?: string;
  images: string[];
  type: PlaceType;
}
