import { IPlace } from "./place";
import { IPlaceRating } from "./place-rating";
import { IRating } from "./rating";
import { IPlaceFollower } from "./follower";

export interface IPlaceAuthorExposed {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

export interface IPlaceExposed extends Omit<IPlace, "author"> {
  author: string | IPlaceAuthorExposed;
  _id: string;
  rating: IRating;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
  userRating?: IPlaceRating;
  userFollow?: IPlaceFollower;
  subcribers?: number;
}
