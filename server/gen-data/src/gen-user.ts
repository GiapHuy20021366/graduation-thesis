import { IProfile, IUserSchema } from "./typed";
import { genCategories, genTime, hash, uuid } from "./gen-common";
import { DEFAULT_PASSWORD } from "./env";
import { readJSON, saveJSON } from "./json";

const profiles = readJSON<IProfile[]>("../pre-data/profiles.json");
const coreProfiles = readJSON<IProfile[]>("../pre-data/core-profiles.json");

export const genUserSchema = (profile: IProfile): IUserSchema => {
  const [firstName, lastName] = profile.name.split(" ");
  const genValid = genTime();
  return {
    _id: {
      $oid: uuid(),
    },
    __v: 0,
    active: true,
    avatar: profile.avatar,
    categories: genCategories(),
    createdAt: genValid,
    updatedAt: genValid,
    description: "",
    email: profile.email,
    exposedName: profile.name,
    firstName: firstName,
    lastName: lastName,
    location: profile.location,
    password: hash(DEFAULT_PASSWORD),
    validSince: genValid,
  };
};

const users: IUserSchema[] = [];
coreProfiles.forEach((profile) => users.push(genUserSchema(profile)));
profiles.forEach((profile) => users.push(genUserSchema(profile)));

saveJSON("../generated/users.json", users);
console.log("Generated ", users.length, " users");
