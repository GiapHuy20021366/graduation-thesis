import { WEB_APP_HOST } from "../config";

export const toActiveMannualAccountUrl = (token: string) => {
    return WEB_APP_HOST + "/signup/verify?token=" + token;
}