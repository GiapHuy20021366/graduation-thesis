import { IPlaceSchema } from "../db/model";

export interface IPlaceAuthorExposed {
  firstName: string;
  lastName: string;
  email: string;
  _id: string;
}

export interface IPlaceExposed extends Omit<IPlaceSchema, "author"> {
  author: string | IPlaceAuthorExposed;
  _id: string;
}
