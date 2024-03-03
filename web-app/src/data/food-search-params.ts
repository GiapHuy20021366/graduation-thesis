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
  include?: string[];
  exclude?: string[];
}

export interface IFoodSearchPlace {
  include?: string[];
  exclude?: string[];
}

export interface IFoodSearchPopulate {
  user?: boolean;
  place?: boolean;
}

export interface IFoodSearchParams {
  user?: IFoodSearchUser;
  place?: IFoodSearchPlace;
  query?: string;
  distance?: IFoodSearchDistance;
  category?: FoodCategory[];
  maxDuration?: number; // time left
  price?: IFoodSearchPrice;
  minQuantity?: number;
  addedBy?: PlaceType[];
  available?: ItemAvailable;
  active?: boolean;
  order?: IFoodSeachOrder;
  pagination?: IPagination;
  populate?: IFoodSearchPopulate;
}
