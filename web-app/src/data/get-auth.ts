import { IAuthInfo } from ".";

export function getAuth(): IAuthInfo | null {
  const authValue = localStorage.getItem("auth");
  let auth: IAuthInfo | null = null;
  if (authValue != null) {
    try {
      const val = JSON.parse(authValue);
      if (typeof val !== "object") return null;
      if (typeof val.token !== "string") return null;
      if (typeof val.updatedAt !== "number") return null;
      if (Date.now() - val.updatedAt < 1 * 60 * 60 * 1000) return null;

      auth = val;
    } catch (error) {
      // Do nothing
    }
  }
  return auth;
}
