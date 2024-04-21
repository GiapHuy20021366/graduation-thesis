import { genTime, randInt, uuid } from "./gen-common";
import { readJSON, saveJSON } from "./json";
import { IFollowerSchema, IPlaceSchema, IUserSchema, Oided } from "./typed";

const places = readJSON<IPlaceSchema[]>("../generated/places.json");
const users = readJSON<IUserSchema[]>("../generated/users.json");

export const genUserFollower = (
  subcriber: Oided,
  target: Oided
): IFollowerSchema => {
  const time = genTime();
  return {
    _id: {
      $oid: uuid(),
    },
    createdAt: time,
    updatedAt: time,
    role: 1,
    subcriber: subcriber,
    type: 8,
    user: target,
  };
};

export const genPlaceFollower = (
  subcriber: Oided,
  target: Oided,
  type: 1 | 8
): IFollowerSchema => {
  const time = genTime();
  return {
    _id: {
      $oid: uuid(),
    },
    createdAt: time,
    updatedAt: time,
    role: 2,
    subcriber: subcriber,
    type: type,
    place: target,
  };
};

// author of place should have admin follow
const followers: IFollowerSchema[] = [];
places.forEach((place) =>
  followers.push(genPlaceFollower(place.author, place._id, 8))
);

const coreUsers = users.slice(0, 3);
const secondaryUsers = users.slice(3);
// Each user should follow at least 5 user and 10 place
users.forEach((user) => {
  coreUsers.forEach((cuser) => {
    if (cuser._id.$oid !== user._id.$oid) {
      followers.push(genUserFollower(user._id, cuser._id));
    }
  });
  const sUserNum = randInt(5, 10);
  for (let i = 0; i < sUserNum; ++i) {
    const randIdx = randInt(0, secondaryUsers.length - 1);
    const suser = secondaryUsers[randIdx];
    if (suser._id.$oid === user._id.$oid) {
      continue;
    }
    if (
      followers.findIndex(
        (f) =>
          f.role === 1 &&
          f.subcriber.$oid === user._id.$oid &&
          f.user?.$oid === suser._id.$oid
      ) === -1
    ) {
      followers.push(genUserFollower(user._id, suser._id));
    }
  }

  //   Follow place
  const placeNum = randInt(10, 15);
  for (let i = 0; i < placeNum; ++i) {
    const randIdx = randInt(0, secondaryUsers.length - 1);
    const place = places[randIdx];
    if (
      followers.findIndex(
        (f) =>
          f.role === 2 &&
          f.subcriber.$oid === user._id.$oid &&
          f.place?.$oid === place._id.$oid
      ) === -1
    ) {
      followers.push(genPlaceFollower(user._id, place._id, 1));
    }
  }
});

saveJSON("../generated/followers.json", followers);
console.log("Generated ", followers.length, " follows");
