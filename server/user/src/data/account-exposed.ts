import { Ided } from "./schemad";
import { IUserCredential, IUserPersonal } from "./user";

export interface AccountExposed
  extends Ided,
    Partial<Pick<IUserCredential, "active" | "email">>,
    Partial<
      Pick<
        IUserPersonal,
        "avatar" | "location" | "firstName" | "lastName" | "exposedName"
      >
    > {
  token: string;
}
