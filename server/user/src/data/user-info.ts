import { GoogleOAuthInfo } from "./google-oauth-info";
import { ILocation } from "./location";
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
