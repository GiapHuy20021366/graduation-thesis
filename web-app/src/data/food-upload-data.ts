import { ICoordinates } from "./coordinates";
import { FoodCategory } from "./food-category";

export interface IFoodUpLoadLocation {
  name: string;
  coordinates: ICoordinates;
}

export interface IFoodUploadData {
  images: string[];
  title: string;
  location: IFoodUpLoadLocation;
  categories: FoodCategory[];
  description: string;
  quantity: number;
  duration: number;
  price: number;
}
