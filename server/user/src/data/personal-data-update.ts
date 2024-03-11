import {
  isAllNotEmptyString,
  isLocation,
  isNotEmptyString,
} from "./data-validate";
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

export const toPersonalDataUpdate = (value: any): IPersonalDataUpdate => {
  if (typeof value !== "object") return {};

  const result: IPersonalDataUpdate = {};
  const updated = value.updated;
  if (typeof updated === "object") {
    result.updated = {};
    const {
      exposedName,
      firstName,
      lastName,
      avatar,
      categories,
      description,
      location,
    } = updated;
    if (isNotEmptyString(exposedName)) {
      result.updated.exposedName = exposedName;
    }
    if (isNotEmptyString(firstName)) {
      result.updated.firstName = firstName;
    }
    if (isNotEmptyString(lastName)) {
      result.updated.lastName = lastName;
    }
    if (isNotEmptyString(avatar)) {
      result.updated.avatar = avatar;
    }
    if (isAllNotEmptyString(categories)) {
      result.updated.categories = categories;
    }
    if (isNotEmptyString(description)) {
      result.updated.description = description;
    }
    if (isLocation(location)) {
      result.updated.location = location;
    }
  }

  const deleted = value.deleted;
  if (typeof deleted === "object") {
    result.deleted = deleted;
  }
  return result;
};
