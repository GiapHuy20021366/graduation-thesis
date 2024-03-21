import { ICoordinates } from "./coordinates";
import { OrderState } from "./order-state";
import { Paginationed, Queried } from "./schemad";

export interface IUserSearchDistance {
  max: number;
  current: ICoordinates;
}

export interface IUserSearchOrder {
  time?: OrderState;
  distance?: OrderState;
  like?: OrderState;
}

export interface IUserSearchParams extends Paginationed, Queried {
  distance?: IUserSearchDistance;
  order?: IUserSearchOrder;
}
