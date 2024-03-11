import { ICoordinates } from "./coordinates";
import {
  isArrayPlaceTypes,
  isCoordinates,
  isNotEmptyString,
  isNumber,
  isObjectId,
  isPagination,
} from "./data-validate";
import { OrderState } from "./order-state";
import { IPagination } from "./pagination";
import { PlaceType } from "./place-type";

export interface IPlaceSearchOrder {
  distance?: OrderState;
  rating?: OrderState;
}

export interface IPlaceSearchParams {
  query?: string;
  author?: string;
  maxDistance?: number;
  minRating?: number;
  order?: IPlaceSearchOrder;
  currentLocation?: ICoordinates;
  pagination?: IPagination;
  types?: PlaceType[];
}

const toPlaceSearchOrder = (value: any): IPlaceSearchOrder | undefined => {
  if (value == null || typeof value !== "object") return;
  const result: IPlaceSearchOrder = {};
  if (Object.values(OrderState).includes(value.distance)) {
    result.distance = value.distance;
  }
  if (Object.values(OrderState).includes(value.rating)) {
    result.rating = value.rating;
  }
  return result;
};

export const toPlaceSearchParams = (
  value: any
): IPlaceSearchParams | undefined => {
  if (value == null || typeof value !== "object") return;
  const result: IPlaceSearchParams = {};
  if (isNotEmptyString(value.query)) {
    result.query = value.query;
  }
  if (isObjectId(value.author)) {
    result.author = value.author;
  }
  if (isNumber(value.maxDistance) && value.maxDistance > 0) {
    result.maxDistance = value.maxDistance;
  }
  if (isNumber(value.minRating)) {
    result.minRating = value.minRating;
  }
  result.order = toPlaceSearchOrder(value.order);
  if (isCoordinates(value.currentLocation)) {
    result.currentLocation = value.currentLocation;
  }
  if (isPagination(value.pagination)) {
    result.pagination = value.pagination;
  } else {
    result.pagination = {
      skip: 0,
      limit: 24,
    };
  }
  if (isArrayPlaceTypes(value.types)) {
    result.types = value.types;
  }
  return result;
};
