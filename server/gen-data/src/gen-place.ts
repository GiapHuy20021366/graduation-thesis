import {
  IPlaceProfile,
  IPlaceSchema,
  IProfile,
  IUserSchema,
  PlaceType,
} from "./typed";
import { genCategories, genImages, genTime, uuid } from "./gen-common";
import { readJSON, saveJSON } from "./json";

const placeProfiles = readJSON<IProfile[]>("../pre-data/places.json");
const users = readJSON<IUserSchema[]>("../generated/users.json");

export const genPlaceSchema = (
  profile: IPlaceProfile,
  author: string,
  type: number
): IPlaceSchema => {
  const time = genTime();
  return {
    __v: 0,
    _id: {
      $oid: uuid(),
    },
    active: true,
    author: {
      $oid: author,
    },
    categories: genCategories(),
    createdAt: time,
    updatedAt: time,
    description: "",
    exposedName: profile.name,
    images: genImages(),
    location: profile.location,
    rating: {
      count: 0,
      mean: 0,
    },
    type: type,
  };
};

const places: IPlaceSchema[] = [];

let ithProfile = 0;
const length = placeProfiles.length;
users.forEach((user) => {
  ithProfile = ithProfile % length;
  const userId = user._id.$oid;
  Object.values(PlaceType).forEach((type) => {
    places.push(genPlaceSchema(placeProfiles[ithProfile], userId, type));
    ++ithProfile;
  });
});

saveJSON("../generated/places.json", places);
console.log("Generated ", places.length, " places");
