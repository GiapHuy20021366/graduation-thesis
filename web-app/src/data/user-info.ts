import { ICoordinates } from "./coordinates";

export interface IUserInfo {
  location?: {
    name: string;
    coordinates: ICoordinates;
  };
  id_: string;
  email: string;
  firstName: string;
  lastName: string;
  titles?: string[];
  avartar?: string;
}