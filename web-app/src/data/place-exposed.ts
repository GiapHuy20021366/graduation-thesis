import { IPlace } from "./place";
import { IRating } from "./rating";

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
}
