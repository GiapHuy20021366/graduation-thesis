import { WEB_APP_HOST } from "../config";

export const toActiveManualAccountUrl = (token: string) => {
  return WEB_APP_HOST + "/verify/signup?token=" + token;
};
