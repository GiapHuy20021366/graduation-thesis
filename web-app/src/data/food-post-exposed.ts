import { IFoodUploadData } from ".";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";

export interface IFoodPostExposedUser {
  _id: string;
  firstName: string;
  lastName: string;
  avartar?: string;
  location?: ILocation;
}

export interface IFoodPostExposedPlace {
  _id: string;
  exposeName: string;
  avartar?: string;
  type: PlaceType;
  location: ILocation;
}

export interface IFoodPostExposedLike {
  _id: string;
  createdAt: string | Date;
  user: string;
  foodPost: string;
}

export interface IFoodPostExposed extends Omit<IFoodUploadData, "place"> {
  _id: string;
  user: string | IFoodPostExposedUser;
  place?: string | IFoodPostExposedPlace;
  likeCount: number;
}

export interface IFoodPostExposedWithLike extends IFoodPostExposed {
  liked?: boolean;
  like?: IFoodPostExposedLike;
}
