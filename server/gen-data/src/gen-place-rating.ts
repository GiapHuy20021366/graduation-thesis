import { genTime, randInt, uuid } from "./gen-common";
import { readJSON, saveJSON } from "./json";
import { IPlaceRatingSchema, IPlaceSchema, IUserSchema, Oided } from "./typed";

export const genPlaceFollower = (
  place: Oided,
  user: Oided
): IPlaceRatingSchema => {
  const time = genTime();
  return {
    __v: 0,
    _id: {
      $oid: uuid(),
    },
    createdAt: time,
    updatedAt: time,
    place: place,
    score: randInt(2, 5),
    user: user,
  };
};

const users = readJSON<IUserSchema[]>("../generated/users.json");
const places = readJSON<IPlaceSchema[]>("../generated/places.json");

const placeRatings: IPlaceRatingSchema[] = [];
users.forEach((user) => {
  const num = randInt(10, 15);
  for (let i = 0; i < num; ++i) {
    const idx = randInt(0, places.length - 1);
    const place = places[idx];
    if (
      placeRatings.findIndex(
        (r) => r.user.$oid === user._id.$oid && r.place.$oid === place._id.$oid
      ) === -1
    ) {
      placeRatings.push(genPlaceFollower(place._id, user._id));
    }
  }
});

// Update rating of place
const placeToRatings: Record<string, IPlaceRatingSchema[]> = {};
placeRatings.forEach((r) => {
  let rs = placeToRatings[r.place.$oid];
  if (rs == null) {
    rs = [];
    placeToRatings[r.place.$oid] = rs;
  }
  rs.push(r);
});
places.forEach((p) => {
  const rs = placeToRatings[p._id.$oid];
  if (rs != null && rs.length > 0) {
    let sum = 0;
    rs.forEach((r) => (sum += r.score));
    p.rating = {
      count: rs.length,
      mean: sum / rs.length,
    };
  }
});

saveJSON("../generated/places.json", places);
saveJSON("../generated/place-ratings.json", placeRatings);
console.log("Generated ", placeRatings.length, " ratings");

