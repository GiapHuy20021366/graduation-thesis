import { ICoordinates } from "./coordinates";
import { FoodCategory } from "./food-category";
import { OrderState } from "./order-state";
import { PlaceType } from "./place-type";
import { Paginationed, Queried } from "./schemad";

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

export interface IFoodPostResolveBy {
  include?: string[];
  exclude?: string[];
}

export interface IFoodSearchDuration {
  from?: number;
  to?: number;
}

export interface IFoodSearchTime {
  from?: number;
  to?: number;
}

export interface IFoodSearchQuantity {
  min?: number;
  max?: number;
}

export interface IFoodSearchParams extends Queried, Paginationed {
  user?: IFoodSearchUser;
  place?: IFoodSearchPlace;
  distance?: IFoodSearchDistance;
  category?: FoodCategory[];
  price?: IFoodSearchPrice;
  addedBy?: PlaceType[];
  active?: boolean;
  resolved?: boolean;
  resolveBy?: IFoodPostResolveBy;
  time?: IFoodSearchTime;
  duration?: IFoodSearchDuration;
  quantity?: IFoodSearchQuantity;
  populate?: IFoodSearchPopulate;
  order?: IFoodSeachOrder;
}
