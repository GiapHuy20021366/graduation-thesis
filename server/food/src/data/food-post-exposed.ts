import { HydratedDocument } from "mongoose";
import { IFoodPostSchema } from "../db/model";
import { IFoodPostLocation } from "./food-post";
import { ILocation } from "./location";
import { PlaceType } from "./place-type";
import { Ided, Named, Timed } from "./schemad";

export interface IFoodPostExposedUser extends Ided {
  firstName: string;
  lastName: string;
  avatar?: string;
  location?: IFoodPostLocation;
}

export interface IFoodPostExposedPlace extends Ided, Named {
  avatar?: string;
  type: PlaceType;
  location: ILocation;
}

export interface IFoodPostExposedLike extends Ided, Pick<Timed, "createdAt"> {
  user: string;
  foodPost: string;
}

export interface IFoodPostExposed
  extends Omit<IFoodPostSchema, "user" | "place" | "description">,
    Ided {
  user: string | IFoodPostExposedUser;
  place?: string | IFoodPostExposedPlace;
  description?: string;
}

export interface IFoodPostExposedWithLike extends IFoodPostExposed {
  like?: IFoodPostExposedLike;
  liked: boolean;
}

export const toFoodPostExposed = (
  data: HydratedDocument<IFoodPostSchema>,
  advance?: {
    description?: boolean;
  }
): IFoodPostExposed => {
  const result: IFoodPostExposed = {
    _id: data._id.toString(),
    active: data.active,
    categories: data.categories,
    createdAt: data.createdAt,
    duration: data.duration,
    images: data.images,
    isEdited: data.isEdited,
    likeCount: data.likeCount,
    location: data.location,
    price: data.price,
    quantity: data.quantity,
    resolveBy: data.resolveBy,
    resolved: data.resolved,
    title: data.title,
    updatedAt: data.updatedAt,
    user: data.user,
    place: data.place?._id,
    resolveTime: data.resolveTime,
  };
  if (advance?.description) {
    result.description = data.description;
  }
  return result;
};
