import { IPlace } from "./place";
import { IPlaceRating } from "./place-rating";
import { IRating } from "./rating";
import { IPlaceFollower } from "./follower";
import { Timed } from "./schemad";

export interface IPlaceExposedAuthor {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

export interface IPlaceExposed extends Omit<IPlace, "author"> {
  author: string | IPlaceExposedAuthor;
  _id: string;
  rating: IRating;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IPlaceExposedWithRatingAndFollow extends IPlaceExposed {
  userRating?: IPlaceRating & Timed;
  userFollow?: IPlaceFollower & Timed;
  subcribers?: number;
}
