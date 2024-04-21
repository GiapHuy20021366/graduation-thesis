import { HydratedDocument, ObjectId } from "mongoose";
import { IPlaceSchema } from "../db/model";
import { Ided, Timed, toId } from "./schemad";
import { IPlaceRating } from "./place-rating";
import { IPlaceFollower } from "./follower";

export interface IPlaceExposedAuthor {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

export interface IPlaceExposed
  extends Omit<IPlaceSchema, "author" | "description"> {
  author: string | IPlaceExposedAuthor;
  _id: string;
  description?: string;
}

export const toPlaceExposed = (
  place: HydratedDocument<
    Omit<IPlaceSchema, "author"> & {
      author: ObjectId | Ided;
    }
  >,
  meta?: {
    author?: IPlaceExposedAuthor;
  },
  advance?: {
    description?: boolean;
  }
): IPlaceExposed => {
  const author = place.author;
  const result: IPlaceExposed = {
    _id: place._id.toString(),
    active: place.active,
    author: meta?.author ?? toId(author),
    categories: place.categories,
    createdAt: place.createdAt,
    exposedName: place.exposedName,
    images: place.images,
    location: place.location,
    rating: place.rating,
    type: place.type,
    updatedAt: place.updatedAt,
    avatar: place.avatar,
  };

  if (advance?.description) {
    result.description = place.description;
  }
  return result;
};

export interface IPlaceExposedWithRatingAndFollow extends IPlaceExposed {
  userRating?: IPlaceRating & Timed;
  userFollow?: IPlaceFollower & Timed;
  subcribers?: number;
}
