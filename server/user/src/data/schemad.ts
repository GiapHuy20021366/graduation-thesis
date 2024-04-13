import { ObjectId } from "mongoose";
import { IPagination } from "./pagination";

export interface Ided {
  _id: string;
}

export interface Timed {
  createdAt: Date;
  updatedAt: Date;
}

export interface Named {
  exposedName: string;
}

export interface Actived {
  active: boolean;
}

export interface Edited {
  isEdited: boolean;
}

export interface Paginationed {
  pagination?: IPagination;
}

export interface Queried {
  query?: string;
}

export interface Schemad extends Ided, Timed {}

export const toId = (object: ObjectId | Ided): string => {
  if (typeof object === "string") return object;
  return (<Ided>object)._id;
};

export interface Followed {
  followed: boolean;
}
