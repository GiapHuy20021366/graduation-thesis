import { Model, Schema, HydratedDocument, model } from 'mongoose';
import collections from '../collections';
import { UserInfo } from '../../data';

interface IUserMethods {
  // fullName(): string;
}

interface IUserModel extends Model<UserInfo, {}, IUserMethods> {
  findByEmail(email: string): Promise<HydratedDocument<UserInfo, IUserMethods>>;
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

export const User = model<UserInfo, IUserModel>('User', userSchema, collections.user);

export default User;
