import { ICoordinates } from "./coordinates";
import { GoogleOAuthInfo } from "./google-oauth-info";

export interface ILocation {
  name: string;
  coordinates: ICoordinates;
  two_array?: number[];
}

export interface UserInfo {
  googleOAuth?: GoogleOAuthInfo;
  createdAt: Date;
  updatedAt: Date;
  validSince: Date;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  titles?: string[];
  avatar: string;
  location?: ILocation;
}
