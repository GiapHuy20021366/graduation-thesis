import { ICoordinates, IPagination, PlaceType } from ".";
import { OrderState } from "./order-state";

export interface IPlaceSearchAuthor {
  include?: string[];
  exclude?: string[];
}

export interface IPlaceSearchOrder {
  distance?: OrderState;
  rating?: OrderState;
  time?: OrderState;
}

export interface IPlaceSearchDistance {
  current: ICoordinates;
  max: number;
}

export interface IPlaceSearchRating {
  min?: number;
  max?: number;
}

export interface IPlaceSearchParams {
  query?: string;
  author?: IPlaceSearchAuthor;
  distance?: IPlaceSearchDistance;
  order?: IPlaceSearchOrder;
  pagination?: IPagination;
  types?: PlaceType[];
  rating?: IPlaceSearchRating;
}
