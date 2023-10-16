import { Schema } from "mongoose";

const user = new Schema({
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
  createAt: { type: Date, default: Date.now },
  validSince: { type: Date, default: Date.now },
});

user.methods = {
  
};

user.statics = {
  findByEmail: function (email) {
    return this.find({google: { email } });
  }
};

const User = mongoose.model(
    "User",
    userSchema,
    collections.user
);

export default User;