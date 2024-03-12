import { IUserPersonal } from "./user";

export interface IUserRemovable
  extends Pick<
    IUserPersonal,
    "description" | "location" | "avatar" | "categories"
  > {}

export interface IPersonalDataUpdate {
  updated?: Partial<IUserPersonal>;
  deleted?: {
    [key in keyof Partial<IUserRemovable>]: boolean;
  };
}
