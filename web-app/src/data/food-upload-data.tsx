import { ICoordinates } from "./coordinates";
import { DurationType } from "./duration-type";
import { FoodCategory } from "./food-category";
import { UnitType } from "./unit-type";

export interface IFoodUploadDuration {
  value: number;
  unit: DurationType;
}

export interface IFoodUpoadCount {
  value: number;
  unit: UnitType;
}

export interface IFoodUploadCost {
  value: number;
  unit?: "VNĐ";
}

export interface IFoodUploadData {
  images: string[];
  title: string;
  description: string;
  categories: FoodCategory[];
  location: ICoordinates;
  duration: IFoodUploadDuration;
  count: IFoodUpoadCount;
  quantity: number;
  cost: IFoodUploadCost;
}
