import { ICoordinates } from "./coordinates";
import { isCoordinates, isNumber, isOrderState } from "./data-validate";
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
    const like = order.like;
    if (isOrderState(like) && like !== OrderState.NONE) {
      _order.like = like;
    }
  }

  return result;
};
