import { IUserFollower } from "./follower";
import { Ided, Named, Timed } from "./schemad";
import { IUserCredential, IUserPersonal } from "./user";

export interface IUserExposed
  extends IUserPersonal,
    Ided,
    Pick<Timed, "createdAt">,
    Pick<IUserCredential, "email" | "active"> {}

export interface IUserExposedFollower extends IUserFollower, Ided, Timed {}

export interface IUserExposedWithFollower extends IUserExposed {
  userFollow?: IUserExposedFollower;
}

export interface IUserExposedSimple
  extends Ided,
    Named,
    Omit<IUserPersonal, "description" | "categories">,
    Pick<IUserCredential, "active" | "email"> {}
