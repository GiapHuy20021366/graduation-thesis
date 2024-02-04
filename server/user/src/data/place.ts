import {
  isAllNotEmptyString,
  isEmptyString,
  isLocation,
  isString,
} from "./data-validate";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IPlace {
  exposeName: string;
  description?: string;
  categories: string[];
  location: ILocation;
  avartar?: string;
  images: string[];
  author?: string; // author id
  type: PlaceType;
}

export const toPlace = (value: any): IPlace | undefined => {
  if (typeof value !== "object") return;
  if (!isString(value.exposeName) || isEmptyString(value.exposeName)) return;
  if (value.description != null && !isString(value.description)) return;
  if (value.categories != null && !isAllNotEmptyString(value.categories))
    return;
  if (!isLocation(value.location)) return;
  if (
    value.avartar != null &&
    (isEmptyString(value.avartar) || !isString(value.avartar))
  )
    return;
  if (value.images != null && !isAllNotEmptyString(value.images)) return;

  const result: IPlace = {
    exposeName: value.exposeName as string,
    description: value.description ?? "",
    categories: value.categories ?? [],
    location: value.location as ILocation, // require,
    avartar: value.avartar,
    images: value.images,
    author: value.author as string,
    type: PlaceType.PERSONAL,
  };
  if (Object.values(PlaceType).includes(value.type)) {
    result.type = value.type as PlaceType;
  }
  return result;
};
