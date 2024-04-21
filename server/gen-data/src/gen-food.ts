import {
  genCategories,
  genImages,
  genPrice,
  genTime,
  randInt,
  uuid,
} from "./gen-common";
import { readJSON, saveJSON } from "./json";
import { IFoodSchema, IPlaceSchema, IUserSchema, PlaceType } from "./typed";

const users = readJSON<IUserSchema[]>("../generated/users.json");
const places = readJSON<IPlaceSchema[]>("../generated/places.json");
const foodNames = readJSON<string[]>("../pre-data/foods.json");

const genUserFood = (name: string, user: IUserSchema): IFoodSchema => {
  const now = Date.now();
  const duration = randInt(
    now + 12 * 60 * 60 * 1000,
    now + 7 * 24 * 60 * 60 * 1000
  );
  const time = genTime(0);
  return {
    __v: 0,
    _id: {
      $oid: uuid(),
    },
    active: true,
    categories: genCategories(),
    createdAt: time,
    updatedAt: time,
    duration: {
      $date: new Date(duration).toISOString(),
    },
    images: genImages(),
    isEdited: false,
    likeCount: 0,
    location: user.location,
    price: genPrice(0.3),
    quantity: randInt(2, 5),
    title: name,
    user: user._id.$oid,
    resolved: false,
  };
};

const genPlaceFood = (name: string, place: IPlaceSchema): IFoodSchema => {
  const now = Date.now();
  const duration = randInt(
    now + 12 * 60 * 60 * 1000,
    now + 7 * 24 * 60 * 60 * 1000
  );
  const time = genTime(0);
  return {
    __v: 0,
    _id: {
      $oid: uuid(),
    },
    active: true,
    categories: genCategories(),
    createdAt: time,
    updatedAt: time,
    duration: {
      $date: new Date(duration).toISOString(),
    },
    images: genImages(),
    isEdited: false,
    likeCount: 0,
    location: place.location,
    price: genPrice(place.type === PlaceType.VOLUNTEER ? 0.95 : 0.2),
    quantity: randInt(2, 5),
    title: name,
    user: place.author.$oid,
    place: {
      _id: place._id.$oid,
      type: place.type,
    },
    resolved: false,
  };
};

const foods: IFoodSchema[] = [];
let ith: number = 0;
const length = foodNames.length;
users.forEach((user) => {
  const numFood = randInt(10, 20);
  for (let i = 0; i < numFood; ++i) {
    ith = ith % length;
    foods.push(genUserFood(foodNames[ith], user));
    ++ith;
  }
});

places.forEach((place) => {
  const numFood = randInt(5, 20);
  for (let i = 0; i < numFood; ++i) {
    ith = ith % length;
    foods.push(genPlaceFood(foodNames[ith], place));
    ++ith;
  }
});

saveJSON("../generated/foods.json", foods);
console.log("Generated ", foods.length, " foods");
