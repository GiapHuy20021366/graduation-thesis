import { FoodCategory } from ".";
import { ILocation } from "./location";
import { Named } from "./schemad";

export interface IUserPersonal extends Named {
  firstName: string;
  lastName: string;
  description?: string;
  location?: ILocation;
  avatar?: string;
  categories?: FoodCategory[]; // food categories
}

export interface IUserCredential {
  email: string;
  password: string;
  active: boolean;
}

export interface IUser extends IUserPersonal, IUserCredential {}
