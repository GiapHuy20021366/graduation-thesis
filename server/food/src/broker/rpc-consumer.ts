import { RabbitMQ } from "./rpc";

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

export const initRpcConsumers = (_rabbit: RabbitMQ): void => {
  // Do nothing
};

export const initBrokerConsumners = (_rabbit: RabbitMQ): void => {
  // Do nothing
};
