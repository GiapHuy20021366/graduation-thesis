import { GoogleOAuthInfo } from "./google-oauth-info";
import { ILocation } from "./location";
import { Named } from "./schemad";

export interface IUserPersonal extends Named {
  firstName: string;
  lastName: string;
  description?: string;
  location?: ILocation;
  avatar?: string;
  categories?: string[]; // food categories
}

export interface IUserCredential {
  googleOAuth?: GoogleOAuthInfo;
  validSince: Date;
  email: string;
  password: string;
  active: boolean;
}

export interface IUser extends IUserPersonal, IUserCredential {}
