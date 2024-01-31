import {
  isAllNotEmptyString,
  isEmptyString,
  isLocation,
  isObjectId,
  isString,
} from "./data-validate";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";
import { IRating } from "./rating";

export interface IPlace {
  exposeName: string;
  description: string;
  categories: string[];
  location: ILocation;
  avartar?: string;
  images: string[];
  author: string; // author id
  rating: IRating;
  type: PlaceType;
}

export const toPlace = (value: any): IPlace | undefined => {
  if (typeof value !== "object") return;
  if (!isString(value.exposeName) || isEmptyString(value.exposeName)) return;
  if (value.description != null && !isString(value.description)) return;
  if (value.categories != null && !isAllNotEmptyString(value.categories))
    return;
  if (!isLocation(value.location)) return;
  if (value.avartar != null && isEmptyString(value.avartar)) return;
  if (value.images != null && !isAllNotEmptyString(value.images)) return;
  if (!isObjectId(value.author)) return;

  const result: IPlace = {
    exposeName: value.exposeName as string,
    description: value.description ?? "",
    categories: value.categories ?? [],
    location: value.location as ILocation, // require,
    avartar: value.avartar,
    images: value.images,
    author: value.author as string,
    rating: {
      count: 0,
      mean: 0,
    },
    type: PlaceType.PERSONAL,
  };
  if (Object.values(PlaceType).includes(value.type)) {
    result.type = value.type as PlaceType;
  }
  return result;
};
