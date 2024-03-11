import { ICoordinates } from "./coordinates";

export interface IUserInfo {
  location?: {
    name: string;
    coordinates: ICoordinates;
  };
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  categories?: string[];
  avatar?: string;
}