import {
  ICoordinates,
  IIncludeAndExclude,
  Paginationed,
  PlaceType,
  Queried,
  isArrayPlaceTypes,
  isCoordinates,
  isNotEmptyString,
  isNumber,
  isOrderState,
  isPagination,
  toIncludeAndExclude,
} from ".";
import { OrderState } from "./order-state";

export interface IPlaceSearchAuthor extends IIncludeAndExclude {}

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

export const toPlaceSearchDistance = (
  value: any
): IPlaceSearchDistance | undefined => {
  if (typeof value !== "object") return;
  const { max, current } = value;
  if (!isNumber(max) || !isCoordinates(current)) return;
  return {
    current: current,
    max: max,
  };
};

export const toPlaceSearchOrder = (
  value: any
): IPlaceSearchOrder | undefined => {
  if (typeof value !== "object") return;
  const result: IPlaceSearchOrder = {};
  const { distance, rating, time } = value;
  if (isOrderState(distance) && distance !== OrderState.NONE) {
    result.distance = distance;
  }
  if (isOrderState(rating) && rating !== OrderState.NONE) {
    result.rating = rating;
  }
  if (isOrderState(time) && time !== OrderState.NONE) {
    result.time = time;
  }
  return result;
};

export const toPlaceSearchRating = (
  value: any
): IPlaceSearchRating | undefined => {
  if (typeof value !== "object") return;
  const result: IPlaceSearchRating = {};
  const { min, max } = value;
  if (isNumber(min)) {
    result.min = min;
  }
  if (isNumber(max)) {
    result.max = max;
  }
  return result;
};

export const toPlaceSearchParams = (value: any): IPlaceSearchParams => {
  if (typeof value !== "object") return {};

  const result: IPlaceSearchParams = {};
  result.author = toIncludeAndExclude(value.author);

  const { query, distance, order, pagination, types, rating } = value;
  if (isNotEmptyString(query)) {
    result.query = query;
  }

  result.distance = toPlaceSearchDistance(distance);
  result.order = toPlaceSearchOrder(order);
  if (isPagination(pagination)) {
    result.pagination = pagination;
  }
  if (isArrayPlaceTypes(types)) {
    result.types = types;
  }
  result.rating = toPlaceSearchRating(rating);
  return result;
};
