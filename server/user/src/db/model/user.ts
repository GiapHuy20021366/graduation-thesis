import { Model, Schema, HydratedDocument, model } from "mongoose";
import collections from "../collections";
import { IUser, Timed } from "../../data";

export interface IUserSchema extends IUser, Timed {}

interface IUserMethods {
  isOAuthGoogle(): boolean;
  isOAuthFacebook(): boolean;
}

interface IUserModel extends Model<IUserSchema, {}, IUserMethods> {
  findOneByEmail(
    email: string
  ): Promise<HydratedDocument<IUserSchema, IUserMethods> | null>;
}

const userSchema = new Schema<IUserSchema, IUserModel, IUserMethods>({
  // Named
  exposedName: String,

  // Personal
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  description: {
    type: String,
  },
  location: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
    two_array: {
      type: [Number],
      default: [0, 0],
      index: "2dsphere",
    },
  },
  avatar: {
    type: String,
  },
  categories: {
    type: [String],
    default: [],
  },

  // Credential
  googleOAuth: {
    aud: String,
    azp: String,
    email: String,
    family_name: String,
    given_name: String,
    locale: String,
    sub: String,
    picture: String,
    createdAt: Date,
    updatedAt: Date,
  },
  validSince: { type: Date, default: Date.now },
  email: {
    required: true,
    type: String,
    index: true,
  },
  password: {
    required: true,
    type: String,
  },
  active: {
    type: Boolean,
    default: true,
  },

  // Timed
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

// Statics
userSchema.static("findOneByEmail", function (email: string) {
  return this.findOne({ email: email });
});

// Methods
userSchema.method("isOAuthGoogle", function () {
  return this.googleOAuth !== undefined;
});

export const User = model<IUserSchema, IUserModel>(
  "User",
  userSchema,
  collections.user
);

export default User;
