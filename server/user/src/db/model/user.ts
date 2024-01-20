import { Model, Schema, HydratedDocument, model, Document } from "mongoose";
import collections from "../collections";
import { UserInfo } from "../../data";

export interface UserDocument extends UserInfo, Document {}

interface IUserMethods {
  isOAuthGoogle(): boolean;
  isOAuthFacebook(): boolean;
}

interface IUserModel extends Model<UserDocument, {}, IUserMethods> {
  findOneByEmail(
    email: string
  ): Promise<HydratedDocument<UserDocument, IUserMethods> | null>;
}

const userSchema = new Schema<UserDocument, IUserModel, IUserMethods>({
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
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  validSince: { type: Date, default: Date.now },
  firstName: {
    required: true,
    type: String,
  },
  lastName: {
    required: true,
    type: String,
  },
  email: {
    required: true,
    type: String,
    index: true,
  },
  password: {
    required: true,
    type: String,
  },
  avatar: String,
  titles: {
    type: [String],
    default: [],
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
});

// Statics
userSchema.static("findOneByEmail", function (email: string) {
  return this.findOne({ email: email });
});

// Methods
userSchema.method("isOAuthGoogle", function () {
  return this.googleOAuth !== undefined;
});

export const User = model<UserDocument, IUserModel>(
  "User",
  userSchema,
  collections.user
);

export default User;
