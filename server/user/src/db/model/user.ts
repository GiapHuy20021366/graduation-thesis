import { Model, Schema, HydratedDocument, model } from 'mongoose';
import collections from '../collections';

export interface IGoogleOAuthInfo {
  aud: string,
  azp: string,
  email: string,
  family_name: string,
  given_name: string,
  locale: string,
  sub: string,
  picture: string
}

export interface IUser {
  googleOAuth?: IGoogleOAuthInfo,
  createdAt: Date,
  validSince: Date,
}

interface IUserMethods {
  // fullName(): string;
}

interface IUserModel extends Model<IUser, {}, IUserMethods> {
  findByEmail(email: string): Promise<HydratedDocument<IUser, IUserMethods>>;
}

const userSchema = new Schema<IUser, IUserModel, IUserMethods>({
  googleOAuth: { 
    aud: String,
    azp: String,
    email: String,
    family_name: String,
    given_name: String,
    locale: String,
    sub: String,
    picture: String
  },
  createdAt: { type: Date, default: Date.now },
  validSince: { type: Date, default: Date.now }
});

// Statics
userSchema.static('findByEmail', function (name: string) {
  const [firstName, lastName] = name.split(' ');
  return this.create({ firstName, lastName });
});

// Methods
// schema.method('fullName', function fullName(): string {
//   return this + ' ' + this.lastName;
// });

export const User = model<IUser, IUserModel>('User', userSchema, collections.user);

export default User;
