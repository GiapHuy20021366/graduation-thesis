import { ILocation } from "./location";

export interface IAccount {
  id_: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  titles?: string[];
  location?: ILocation;
}
