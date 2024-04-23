import { HydratedDocument } from "mongoose";
import { toFoodPostExposed } from "../data";
import { FoodPost, IFoodPostSchema, UserCached } from "../db/model";
import { consoleLogger } from "../config";
import { rpcGetPlaceSubcribers, rpcGetUserSubcribers } from "./rpc";
import { BrokerSource, RabbitMQ, brokerOperations } from "../broker";
import { TaskScheduler } from "../utils";

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
  const limit = 5;
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
            // duration: {
            //   $gt: Date.now(),
            // },
            // createdAt: {
            //   $gt: Date.now() - 24 * 60 * 60 * 1000,
            // },
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
            const ids = data.map((d) => d.user);
            RabbitMQ.instance.publicMessage(
              BrokerSource.MESSAGE,
              brokerOperations.food.NOFITY_FOOD_AROUND,
              {
                foods: foodIds,
                users: ids,
              }
            );
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
