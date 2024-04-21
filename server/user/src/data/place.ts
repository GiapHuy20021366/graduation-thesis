import {
  isAllNotEmptyString,
  isEmptyString,
  isLocation,
  isString,
} from "./data-validate";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IPlace {
  exposedName: string;
  description?: string;
  categories: string[];
  location: ILocation;
  avatar?: string;
  images: string[];
  author?: string; // author id
  type: PlaceType;
}

export interface IPlaceData extends Omit<IPlace, "author"> {}

export const toPlace = (value: any): IPlace | undefined => {
  if (typeof value !== "object") return;
  if (!isString(value.exposedName) || isEmptyString(value.exposedName)) return;
  if (value.description != null && !isString(value.description)) return;
  if (value.categories != null && !isAllNotEmptyString(value.categories))
    return;
  if (!isLocation(value.location)) return;
  if (
    value.avatar != null &&
    (isEmptyString(value.avatar) || !isString(value.avatar))
  )
    return;
  if (value.images != null && !isAllNotEmptyString(value.images)) return;

  const result: IPlace = {
    exposedName: value.exposedName as string,
    description: value.description ?? "",
    categories: value.categories ?? [],
    location: value.location as ILocation, // require,
    avatar: value.avatar,
    images: value.images,
    author: value.author as string,
    type: PlaceType.PERSONAL,
  };
  if (Object.values(PlaceType).includes(value.type)) {
    result.type = value.type as PlaceType;
  }
  return result;
};
