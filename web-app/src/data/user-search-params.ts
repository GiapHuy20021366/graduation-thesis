import { ICoordinates } from "./coordinates";
import { OrderState } from "./order-state";
import { IPagination } from "./pagination";

export interface IUserSearchDistance {
  max: number;
  current: ICoordinates;
}

export interface IUserSearchOrder {
  time?: OrderState;
  distance?: OrderState;
  like?: OrderState;
}

export interface IUserSearchParams {
  query?: string;
  distance?: IUserSearchDistance;
  pagination?: IPagination;
  order?: IUserSearchOrder;
}
