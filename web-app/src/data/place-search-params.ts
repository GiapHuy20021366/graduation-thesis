import { ICoordinates } from "./coordinates";
import { OrderState } from "./order-state";
import { PlaceType } from "./place-type";
import { Paginationed, Queried } from "./schemad";

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

export interface IPlaceSearchParams extends Paginationed, Queried {
  author?: IPlaceSearchAuthor;
  distance?: IPlaceSearchDistance;
  order?: IPlaceSearchOrder;
  types?: PlaceType[];
  rating?: IPlaceSearchRating;
}
