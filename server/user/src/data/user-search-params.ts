import { ICoordinates } from "./coordinates";
import { isCoordinates, isNumber, isOrderState } from "./data-validate";
import { OrderState } from "./order-state";
import { Paginationed, Queried } from "./schemad";

export interface IUserSearchDistance {
  max: number;
  current: ICoordinates;
}

export interface IUserSearchOrder {
  time?: OrderState;
  distance?: OrderState;
}

export interface IUserSearchParams extends Paginationed, Queried {
  distance?: IUserSearchDistance;
  order?: IUserSearchOrder;
}

export const toUserSearchParams = (value: any): IUserSearchParams => {
  if (typeof value !== "object") return {};
  const result: IUserSearchParams = {};

  const query = value.query;
  if (typeof query === "string" && query.trim().length > 0) {
    result.query = query;
  }

  const distance = value.distance;
  if (typeof distance === "object") {
    const current = distance.current;
    const max = distance.max;
    if (isCoordinates(current) && isNumber(max)) {
      result.distance = {
        current: current,
        max: max,
      };
    }
  }

  const pagination = value.pagination;
  if (typeof pagination === "object") {
    const skip = pagination.skip;
    const limit = pagination.limit;
    result.pagination = {
      skip: isNumber(skip) ? skip : 0,
      limit: isNumber(limit) ? limit : 0,
    };
  }

  const order = value.order;
  if (typeof order === "object") {
    const _order: IUserSearchOrder = {};
    const time = order.time;
    if (isOrderState(time) && time !== OrderState.NONE) {
      _order.time = time;
    }
    const distance = order.distance;
    if (isOrderState(distance) && distance !== OrderState.NONE) {
      _order.distance = distance;
    }
  }

  return result;
};
