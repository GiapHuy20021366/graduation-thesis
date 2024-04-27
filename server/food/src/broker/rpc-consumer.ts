import { RabbitMQ } from "./rpc";

export const RpcAction = {
  USER_RPC_GET_INFO: "rpcGetUserInfo",
  USER_RPC_GET_USER_BY_ID: "rpcGetUserById",
  USER_RPC_GET_DICT_USER_BY_LIST_ID: "rpcGetDictUserByListId",
  USER_RPC_GET_PLACE_BY_ID: "rpcGetPlaceById",
  USER_RPC_GET_DICT_PLACE_BY_LIST_ID: "rpcGetDictPlaceByListId",
  USER_RPC_GET_REGISTERS_BY_USER_ID: "rpcGetRegistersByUserId",
  USER_RPC_GET_RATED_SCORES_BY_USER_ID: "rpcGetRatedScoresByUserId",
  USER_RPC_GET_PLACE_SUBCRIBERS_BY_PLACE_ID: "rpcGetPlaceSubcribersByPlaceId",
  USER_RPC_GET_USER_SUBCRIBERS_BY_USER_ID: "rpcGetUserSubcribersByUserId",
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
}

export const initRpcConsumers = (_rabbit: RabbitMQ): void => {
  // Do nothing
};

export const initBrokerConsumners = (_rabbit: RabbitMQ): void => {
  // Do nothing
};
