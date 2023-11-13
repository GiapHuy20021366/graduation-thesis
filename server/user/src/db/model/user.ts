import { Model, Schema, HydratedDocument, model } from 'mongoose';
import collections from '../collections';
import { UserInfo } from '../../data';

interface IUserMethods {
  isOAuthGoogle(): boolean;
  isOAuthFacebook(): boolean;
}

interface IUserModel extends Model<UserInfo, {}, IUserMethods> {
  findOneByEmail(email: string): Promise<HydratedDocument<UserInfo, IUserMethods> | null>;
}

const userSchema = new Schema<UserInfo, IUserModel, IUserMethods>({
  googleOAuth: {
    aud: String,
    azp: String,
    email: String,
    family_name: String,
    given_name: String,
    locale: String,
    sub: String,
    picture: String,
    createdAt: Date
  },
  createdAt: { type: Date, default: Date.now },
  validSince: { type: Date, default: Date.now },
  firstName: {
    required: true,
    type: String
  },
  lastName: {
    required: true,
    type: String
  },
  email: {
    required: true,
    type: String,
    index: true
  },
  password: {
    required: true,
    type: String,
  },
  avatar: String,
  titles: {
    type: [String],
    default: []
  }
});

// Statics
userSchema.static('findOneByEmail', function (email: string) {
  return this.findOne({ email: email });
});

// Methods
userSchema.method('isOAuthGoogle', function () {
  return this.googleOAuth !== undefined;
});

export const User = model<UserInfo, IUserModel>('User', userSchema, collections.user);

export default User;
