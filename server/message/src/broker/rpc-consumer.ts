import { Ided } from "../data";
import {
  ManualAccountInfo,
  NewAccountInfo,
  createAroundFoodNotifications,
  createExpiredFoodNotifications,
  createFavoriteFoodNotifications,
  createLikedFoodNotifications,
  createNearExpiredFoodNotifications,
  createNewFoodNotifications,
  sendActiveManualAccount,
  sendNewAccountCreated,
} from "../services";
import { IBrokerMessage, RabbitMQ } from "./rpc";

export const RpcAction = {
  USER_RPC_GET_INFO: "rpcGetUserInfo",
  USER_RPC_GET_USER_BY_ID: "rpcGetUserById",
  USER_RPC_GET_DICT_USER_BY_LIST_ID: "rpcGetDictUserByListId",
  USER_RPC_GET_PLACE_BY_ID: "rpcGetPlaceById",
  USER_RPC_GET_DICT_PLACE_BY_LIST_ID: "rpcGetDictPlaceByListId",
  USER_RPC_GET_REGISTERS_BY_USER_ID: "rpcGetRegistersByUserId",
  USER_RPC_GET_RATED_SCORES_BY_USER_ID: "rpcGetRatedScoresByUserId",
} as const;

export type RpcAction = (typeof RpcAction)[keyof typeof RpcAction];

export const brokerOperations = {
  mail: {
    ACTIVE_MANUAL_ACCOUNT: "ACTIVE_MANUAL_ACCOUNT",
    NEW_ACCOUNT_CREATED: "NEW_ACCOUNT_CREATED",
  },
  food: {
    NOTIFY_NEW_FOOD: "NOTIFY_NEW_FOOD",
    NOFITY_FOOD_AROUND: "NOTIFY_FOOD_AROUND",
    NOTIFY_FOOD_NEAR_EXPIRED: "NOTIFY_FOOD_NEAR_EXPIRED",
    NOTIFY_FOOD_EXPIRED: "NOTIFY_FOOD_EXPIRED",
    NOTIFY_FOOD_FAVORITE: "NOTIFY_FOOD_FAVORITE",
    NOTIFY_FOOD_LIKED: "NOTIFY_FOOD_LIKED",
  },
} as const;

export interface IRpcGetInfoPayLoad {
  _id: string;
}

export interface IRpcGetUserByIdPayload {
  _id: string;
  select?: string | string[];
}

export interface IRpcGetDictUserPayload {
  _ids: string[];
  select?: string | string[];
}

export interface IRpcGetPlaceByIdPayload {
  _id: string;
  select?: string | string[];
}

export interface IRpcGetDictPlacePayload {
  _ids: string[];
  select?: string | string[];
}

export interface IRpcGetRegistersPayload {
  userId: string;
}

export interface IRpcGetRatedScoresPayload {
  userId: string;
}

export interface IBrokerNotifyNewFoodPayloadFood extends Ided {
  user: string;
  place?: string;
}
export interface IBrokerNotifyNewFoodPayload {
  food: IBrokerNotifyNewFoodPayloadFood;
  subcribers: string[];
}

export interface IBrokerNotifyAroundFoodPayload {
  users: string[];
  foods: string[];
}

export interface IBrokerNotifyNearExpiredFoodPayload {
  foodId: string;
  authorId: string;
  placeId?: string;
}

export interface IBrokerNotifyExpiredFoodPayload {
  foodId: string;
  authorId: string;
  placeId?: string;
}

export interface IBrokerNotifyFavoriteFoodPayload {
  userId: string;
  foodIds: string[];
}

export interface IBrokerNotifyLikedFoodPayload {
  userId: string;
  foodId: string;
  authorId: string;
}

export const initRpcConsumers = (_rabbit: RabbitMQ): void => {
  // Do nothing
};

export const initBrokerConsumners = (rabbit: RabbitMQ): void => {
  rabbit.listenMessage(
    brokerOperations.mail.ACTIVE_MANUAL_ACCOUNT,
    (msg: IBrokerMessage<ManualAccountInfo>) => {
      sendActiveManualAccount(msg.data);
    }
  );

  rabbit.listenMessage(
    brokerOperations.mail.NEW_ACCOUNT_CREATED,
    (msg: IBrokerMessage<NewAccountInfo>) => {
      sendNewAccountCreated(msg.data);
    }
  );

  rabbit.listenMessage(
    brokerOperations.food.NOTIFY_NEW_FOOD,
    (msg: IBrokerMessage<IBrokerNotifyNewFoodPayload>) => {
      const { food, subcribers } = msg.data;
      createNewFoodNotifications(food, subcribers);
    }
  );

  rabbit.listenMessage(
    brokerOperations.food.NOFITY_FOOD_AROUND,
    (msg: IBrokerMessage<IBrokerNotifyAroundFoodPayload>) => {
      const { foods, users } = msg.data;
      createAroundFoodNotifications(foods, users);
    }
  );

  rabbit.listenMessage(
    brokerOperations.food.NOTIFY_FOOD_NEAR_EXPIRED,
    (msg: IBrokerMessage<IBrokerNotifyNearExpiredFoodPayload>) => {
      const { authorId, foodId, placeId } = msg.data;
      createNearExpiredFoodNotifications(foodId, authorId, placeId);
    }
  );

  rabbit.listenMessage(
    brokerOperations.food.NOTIFY_FOOD_EXPIRED,
    (msg: IBrokerMessage<IBrokerNotifyExpiredFoodPayload>) => {
      const { authorId, foodId, placeId } = msg.data;
      createExpiredFoodNotifications(foodId, authorId, placeId);
    }
  );

  rabbit.listenMessage(
    brokerOperations.food.NOTIFY_FOOD_FAVORITE,
    (msg: IBrokerMessage<IBrokerNotifyFavoriteFoodPayload>) => {
      const { foodIds, userId } = msg.data;
      createFavoriteFoodNotifications(userId, foodIds);
    }
  );

  rabbit.listenMessage(
    brokerOperations.food.NOTIFY_FOOD_LIKED,
    (msg: IBrokerMessage<IBrokerNotifyLikedFoodPayload>) => {
      const { foodId, userId, authorId } = msg.data;
      createLikedFoodNotifications(userId, foodId, authorId);
    }
  );
};
