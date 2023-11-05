import { GoogleOAuthInfo } from "./google-oauth-info";

export interface UserInfo {
    googleOAuth?: GoogleOAuthInfo,
    createdAt: Date,
    validSince: Date,
    firstName: string,
    lastName: string,
    email: string,
    password?: string,
    titles?: string[]
}