import { Model, Schema, model } from "mongoose";
import collections from "../collections";
import {
  IUserCached,
  IUserCachedFavorite,
  IUserCachedRegister,
  Timed,
} from "../../data";

export interface IUserCachedSchema
  extends Omit<IUserCached, "favorite" | "register">,
    Timed {
  favorite: IUserCachedFavorite & Pick<Timed, "updatedAt">;
  register: IUserCachedRegister & Pick<Timed, "updatedAt">;
}

interface IUserCachedMethods {}

interface IUserCachedModel
  extends Model<IUserCachedSchema, {}, IUserCachedMethods> {}

const userCachedSchema = new Schema<
  IUserCachedSchema,
  IUserCachedModel,
  IUserCachedMethods
>({
  user: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  location: {
    name: String,
    coordinates: {
      lat: {
        type: Number,
      },
      lng: {
        type: Number,
      },
    },
    two_array: {
      type: [Number],
      default: [0, 0],
      index: "2dsphere",
    },
  },
  categories: {
    type: [String],
  },
  favorite: {
    loveds: {
      type: [
        {
          category: String,
          score: Number,
        },
      ],
    },
    rateds: {
      type: [
        {
          category: String,
          score: Number,
        },
      ],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  register: {
    users: {
      type: [
        {
          _id: {
            type: String,
            index: true,
          },
          time: Date,
        },
      ],
    },
    places: {
      type: [
        {
          _id: {
            type: String,
            index: true,
          },
          time: Date,
        },
      ],
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Statics

// Methods

export const UserCached = model<IUserCachedSchema, IUserCachedModel>(
  "UserCached",
  userCachedSchema,
  collections.userCached
);

export default UserCached;
