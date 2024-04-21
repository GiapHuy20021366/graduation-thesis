import { HydratedDocument } from "mongoose";
import { toFoodPostExposed } from "../data";
import { IFoodPostSchema } from "../db/model";
import { consoleLogger } from "../config";
import { rpcGetPlaceSubcribers, rpcGetUserSubcribers } from "./rpc";
import { BrokerSource, RabbitMQ, brokerOperations } from "../broker";

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
