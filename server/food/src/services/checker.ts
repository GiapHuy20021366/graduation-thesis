import { HydratedDocument } from "mongoose";
import { toFoodPostExposed } from "../data";
import { FoodPost, IFoodPostSchema, UserCached } from "../db/model";
import { consoleLogger } from "../config";
import { rpcGetPlaceSubcribers, rpcGetUserSubcribers } from "./rpc";
import { BrokerSource, RabbitMQ, brokerOperations } from "../broker";
import { TaskExecutable, TaskScheduler } from "../utils";
import { getUserCached } from "./cached";
import { getFavoriteFoods } from "./personal";

const CHUNK_SIZE = 100;

export const notifySharedFoodToSubcribers = async (
  food: HydratedDocument<IFoodPostSchema>
) => {
  const exposed = toFoodPostExposed(food);
  const { place, user } = exposed;
  const userId = typeof user === "string" ? user : user._id;
  if (place != null) {
    const placeId = typeof place === "string" ? place : place._id;
    let skip = 0;
    while (true) {
      try {
        const subcribers = await rpcGetPlaceSubcribers(placeId, {
          skip: skip,
          limit: CHUNK_SIZE,
        });
        if (subcribers != null) {
          RabbitMQ.instance.publicMessage(
            BrokerSource.MESSAGE,
            brokerOperations.food.NOTIFY_NEW_FOOD,
            {
              subcribers,
              food: {
                user: userId,
                place: placeId,
                _id: exposed._id,
              },
            }
          );
        } else {
          break;
        }
        if (subcribers.length < CHUNK_SIZE) {
          break;
        } else {
          skip += CHUNK_SIZE;
        }
      } catch (error) {
        consoleLogger.err(
          `Cannot notify food ${food._id} to place subcribers.`
        );
      }
    }
  } else {
    let skip = 0;
    while (true) {
      try {
        const subcribers = await rpcGetUserSubcribers(userId, {
          skip: skip,
          limit: CHUNK_SIZE,
        });
        if (subcribers != null) {
          RabbitMQ.instance.publicMessage(
            BrokerSource.MESSAGE,
            brokerOperations.food.NOTIFY_NEW_FOOD,
            {
              subcribers,
              food: {
                user: userId,
                _id: exposed._id,
              },
            }
          );
        } else {
          break;
        }
        if (subcribers.length < CHUNK_SIZE) {
          break;
        } else {
          skip += CHUNK_SIZE;
        }
      } catch (error) {
        consoleLogger.err(`Cannot notify food ${food._id} to user subcribers.`);
      }
    }
  }
};

export interface IGroupFoodAggregate {
  _id: {
    lng: number;
    lat: number;
  };
  count: number;
  data: HydratedDocument<IFoodPostSchema>[];
}

export const notifyAroundFoodToUsers = async () => {
  const square = 10; // km
  const divider = square / 111.111;
  const limit = 24;
  let skip: number = 0;
  let total: number = 0;
  // Get near 24h found
  while (true) {
    try {
      const groups = await FoodPost.aggregate<IGroupFoodAggregate>([
        {
          $match: {
            active: true,
            resolved: false,
            duration: {
              $gt: new Date(),
            },
            createdAt: {
              $gt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
          },
        },
        {
          $addFields: {
            gridCell: {
              lng: {
                $trunc: { $divide: ["$location.coordinates.lng", divider] },
              },
              lat: {
                $trunc: { $divide: ["$location.coordinates.lat", divider] },
              },
            },
          },
        },
        {
          $group: {
            _id: "$gridCell",
            count: { $sum: 1 },
            data: { $push: "$_id" },
          },
        },
        { $skip: skip },
        { $limit: limit },
      ]);
      // console.log(JSON.stringify(groups.map((g) => g.data)));

      skip += groups.length;
      groups.forEach((g) => {
        total += g.count;
      });
      if (groups.length < 5) {
        consoleLogger.info(
          "[SCHEDULER]",
          "NOTIFY FOOD AROUND",
          "Notified",
          total,
          "foods",
          skip,
          "areas"
        );
        break;
      }
      groups.forEach((group) => {
        const foodIds = group.data.map((d) => d._id.toString());
        const lng = group._id.lng * divider;
        const lat = group._id.lat * divider;
        UserCached.find({
          location: {
            $geoWithin: {
              $centerSphere: [[lng, lat], square / 6378.1],
            },
          },
        })
          .select("_id")
          .then((data) => {
            // consoleLogger.info("Users", data.length);
            const ids = data.map((d) => d.user);
            if (ids.length > 0) {
              RabbitMQ.instance.publicMessage(
                BrokerSource.MESSAGE,
                brokerOperations.food.NOFITY_FOOD_AROUND,
                {
                  foods: foodIds,
                  users: ids,
                }
              );
            }
          });
      });
    } catch (error) {
      consoleLogger.err(error);
    }
  }
};

export const notifyAroundChecker = new TaskScheduler("NOTIFY FOOD AROUND", () =>
  notifyAroundFoodToUsers()
);

export const notifyFoodNearExpireds = async () => {
  let skip: number = 0;
  let total: number = 0;
  const schedular = new TaskExecutable(5);
  while (true) {
    try {
      const foods = await FoodPost.find({
        active: true,
        duration: {
          $lt: Date.now() + 12 * 60 * 60 * 1000,
        },
        resolved: false,
      })
        .skip(skip)
        .limit(CHUNK_SIZE)
        .exec();

      skip += foods.length;
      total += foods.length;
      if (foods.length < CHUNK_SIZE) {
        consoleLogger.info(
          "[SCHEDULER]",
          "NOTIFY NEAR EXPIRED FOOD",
          "Notified",
          total,
          "foods"
        );
        break;
      }
      foods.forEach((food) => {
        schedular.add(() => notifyAFoodNearExpired(food));
      });
    } catch (error) {
      consoleLogger.err(error);
    }
  }
};

export const notifyAFoodNearExpired = async (
  food: HydratedDocument<IFoodPostSchema>
): Promise<boolean> => {
  const authorId = food.user;
  const placeId = food.place?._id;
  // Notify to author
  RabbitMQ.instance.publicMessage(
    BrokerSource.MESSAGE,
    brokerOperations.food.NOFITY_FOOD_AROUND,
    {
      foodId: food._id.toString(),
      authorId: authorId,
      placeId: placeId,
    }
  );
  return true;
};

export const notifyNearExpiredChecker = new TaskScheduler(
  "NOTIFY FOOD NEAR EXPIRED",
  () => notifyFoodNearExpireds()
);

export const notifyFavoriteFoods = async () => {
  let skip: number = 0;
  let total: number = 0;
  const schedular = new TaskExecutable(10);
  while (true) {
    const users = await UserCached.find()
      .select("_id")
      .skip(skip)
      .limit(CHUNK_SIZE);
    total += users.length;
    skip += users.length;

    users.forEach((cached) => {
      schedular.add(() => notifyFavoriteFoodsToAnUser(cached.user));
    });
  }
};

export const notifyFavoriteFoodsToAnUser = async (
  userId: string
): Promise<boolean> => {
  const cached = await getUserCached(userId, {
    basic: false,
    favorite: true,
    register: false,
  });
  if (cached) {
    const favorites = await getFavoriteFoods(userId, { skip: 0, limit: 100 });
    if (favorites.length > 0) {
      RabbitMQ.instance.publicMessage(
        BrokerSource.MESSAGE,
        brokerOperations.food.NOTIFY_FOOD_FAVORITE,
        {
          userId: userId,
          foodIds: favorites.map((f) => f._id.toString()),
        }
      );
    }
  }
  return true;
};

export const notifyFavoriteFoodsChecker = new TaskScheduler(
  "NOTIFY FOOD FAVORITE",
  () => notifyFavoriteFoods()
);

export const notifyLikedFood = async (userId: string, foodId: string) => {
  RabbitMQ.instance.publicMessage(
    BrokerSource.MESSAGE,
    brokerOperations.food.NOTIFY_FOOD_LIKED,
    {
      userId: userId,
      foodId: foodId,
      authorId: foodId,
    }
  );
};

export const notifyFoodExpireds = async () => {
  let skip: number = 0;
  let total: number = 0;
  const schedular = new TaskExecutable(5);
  while (true) {
    try {
      const foods = await FoodPost.find({
        active: true,
        duration: {
          $gt: Date.now() - 12 * 60 * 60 * 1000,
          $lt: Date.now(),
        },
        resolved: false,
      })
        .skip(skip)
        .limit(CHUNK_SIZE)
        .exec();

      skip += foods.length;
      total += foods.length;
      if (foods.length < CHUNK_SIZE) {
        consoleLogger.info(
          "[SCHEDULER]",
          "NOTIFY EXPIRED FOOD",
          "Notified",
          total,
          "foods"
        );
        break;
      }
      foods.forEach((food) => {
        schedular.add(() => notifyAFoodExpired(food));
      });
    } catch (error) {
      consoleLogger.err(error);
    }
  }
};

export const notifyAFoodExpired = async (
  food: HydratedDocument<IFoodPostSchema>
): Promise<boolean> => {
  const authorId = food.user;
  const placeId = food.place?._id;
  // Notify to author
  RabbitMQ.instance.publicMessage(
    BrokerSource.MESSAGE,
    brokerOperations.food.NOTIFY_FOOD_EXPIRED,
    {
      foodId: food._id.toString(),
      authorId: authorId,
      placeId: placeId,
    }
  );
  return true;
};

export const notifyExpiredChecker = new TaskScheduler(
  "NOTIFY FOOD  EXPIRED",
  () => notifyFoodExpireds()
);
