import { ILocation } from "./location";

export interface IAccount {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  categories?: string[];
  location?: ILocation;
}
