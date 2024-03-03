import { ICoordinates } from "./coordinates";
import { ILocation } from "./location";
import { IPagination } from "./pagination";
import { PlaceType } from "./place-type";

export const isObjectId = (value: any): value is string => {
  return typeof value === "string" && value.length === 24;
};

export const isAllObjectId = (value: any): value is string[] => {
  if (!Array.isArray(value)) return false;
  return value.every((v) => isObjectId(v));
};

export const isString = (value: any): value is string => {
  return typeof value == "string";
};

export const isEmptyString = (value: any): value is string => {
  return typeof value === "string" && value.length === 0;
};

export const isNotEmptyString = (value: any): value is string => {
  return !isEmptyString(value);
};

export const isAllNotEmptyString = (value: any): value is string[] => {
  if (!Array.isArray(value)) return false;
  return value.every((v) => isNotEmptyString(v));
};

export const isNumber = (value: any): value is number => {
  return typeof value === "number" && !isNaN(value);
};

export const isArray = (value: any): value is unknown[] => {
  return Array.isArray(value);
};

export const isInteger = (value: any): value is number => {
  return Number.isInteger(value);
};

export const isCoordinates = (value: any): value is ICoordinates => {
  if (typeof value !== "object") return false;
  if (value.lat == null || value.lng == null) return false;
  if (typeof value.lat !== "number" || typeof value.lng !== "number") {
    return false;
  }
  return true;
};

export const isLocation = (value: any): value is ILocation => {
  if (typeof value !== "object") return false;
  return isNotEmptyString(value.name) && isCoordinates(value.coordinates);
};

export const isNotEmptyStringArray = (value: any): value is unknown[] => {
  if (!Array.isArray(value)) return false;
  return value.every((v) => typeof v === "string" && v.length > 0);
};

export const isPagination = (value: any): value is IPagination => {
  if (typeof value !== "object") return false;
  return isNumber(value.skip) && isNumber(value.limit);
};

export const isPlaceType = (value: any): value is PlaceType => {
  return Object.values(PlaceType).includes(value);
};

export const isArrayPlaceTypes = (value: any): value is PlaceType[] => {
  return Array.isArray(value) && value.every((v) => isPlaceType(v));
};
