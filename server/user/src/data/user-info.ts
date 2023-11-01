import { GoogleOAuthInfo } from "./google-oauth-info";

export interface UserInfo {
    googleOAuth?: GoogleOAuthInfo,
    createdAt: Date,
    validSince: Date,
}