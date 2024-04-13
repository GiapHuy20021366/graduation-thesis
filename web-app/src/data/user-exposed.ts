import { IUserFollower } from "./follower";
import { Ided, Named, Timed } from "./schemad";
import { IUserCredential, IUserPersonal } from "./user";

export interface IUserExposedSimple
  extends Ided,
    Named,
    Pick<IUserPersonal, "firstName" | "lastName" | "location" | "avatar">,
    Pick<IUserCredential, "email" | "active"> {}

export interface IUserExposed
  extends Ided,
    Named,
    IUserPersonal,
    Pick<Timed, "createdAt">,
    Pick<IUserCredential, "active" | "email"> {}

export interface IUserExposedFollower
  extends IUserFollower,
    Ided,
    Pick<Timed, "createdAt"> {}

export interface IUserExposedWithFollower extends IUserExposed {
  subcribers: number;
  userFollow?: IUserExposedFollower;
}
