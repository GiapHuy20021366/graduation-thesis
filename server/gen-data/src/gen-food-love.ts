import { genTime, randInt, uuid } from "./gen-common";
import { readJSON, saveJSON } from "./json";
import { IFoodLoveSchema, IFoodSchema, IUserSchema, Oided } from "./typed";

export const genFoodLoveFollower = (
  food: Oided,
  user: Oided
): IFoodLoveSchema => {
  const time = genTime();
  return {
    __v: 0,
    _id: {
      $oid: uuid(),
    },
    createdAt: time,
    foodPost: food,
    user: user.$oid,
  };
};

const users = readJSON<IUserSchema[]>("../generated/users.json");
const foods = readJSON<IFoodSchema[]>("../generated/foods.json");

const foodLoves: IFoodLoveSchema[] = [];
users.forEach((user) => {
  const numFood = randInt(10, 20);
  for (let i = 0; i < numFood; ++i) {
    const idx = randInt(0, foods.length - 1);
    const food = foods[idx];
    if (
      foodLoves.findIndex(
        (l) => l.foodPost.$oid === food._id.$oid && l.user === user._id.$oid
      ) === -1
    ) {
      foodLoves.push(genFoodLoveFollower(food._id, user._id));
    }
  }
});

// Update likeCount of food
const foodToLoves: Record<string, IFoodLoveSchema[]> = {};
foodLoves.forEach((f) => {
  let rs = foodToLoves[f.foodPost.$oid];
  if (rs == null) {
    rs = [];
    foodToLoves[f.foodPost.$oid] = rs;
  }
  rs.push(f);
});
foods.forEach((f) => {
  const rs = foodToLoves[f._id.$oid];
  if (rs != null) {
    f.likeCount = rs.length;
  }
});
saveJSON("../generated/food-loves.json", foodLoves);
saveJSON("../generated/foods.json", foods);
console.log("Generated ", foodLoves.length, " loves");
