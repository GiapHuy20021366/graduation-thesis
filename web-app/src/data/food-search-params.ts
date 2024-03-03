import { PlaceType } from ".";
import { ICoordinates } from "./coordinates";
import { FoodCategory } from "./food-category";
import { ItemAvailable } from "./item-available";
import { OrderState } from "./order-state";
import { IPagination } from "./pagination";

export interface IFoodSearchPrice {
  min?: number;
  max?: number;
}

export interface IFoodSeachOrder {
  relative?: OrderState;
  distance?: OrderState;
  time?: OrderState;
  price?: OrderState;
  quantity?: OrderState;
}

export interface IFoodSearchDistance {
  max: number;
  current: ICoordinates;
}

export interface IFoodSearchUser {
  include?: string | string[];
  exclude?: string | string[];
}

export interface IFoodSearchPlace {
  include?: string | string[];
  exclude?: string | string[];
  type?: PlaceType | PlaceType[];
}

export interface IFoodSearchParams {
  query?: string;
  order?: IFoodSeachOrder;
  distance?: IFoodSearchDistance;
  categories?: FoodCategory[];
  maxDuration?: number; // time left
  price?: IFoodSearchPrice;
  minQuantity?: number;
  addedBy?: PlaceType;
  available?: ItemAvailable;
  pagination?: IPagination;
}
