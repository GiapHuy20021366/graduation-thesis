import {
  MESSAGE_SERVICE,
  USER_SERVICE,
  FOOD_SERVICE,
  USER_SERVICE_RPC_QUEUE,
  MESSAGE_SERVICE_RPC_QUEUE,
  FOOD_SERVICE_RPC_QUEUE,
} from "../config";

export const RpcSource = {
  USER: USER_SERVICE_RPC_QUEUE,
  MESSAGE: MESSAGE_SERVICE_RPC_QUEUE,
  FOOD: FOOD_SERVICE_RPC_QUEUE,
} as const;

export type RpcSource = (typeof RpcSource)[keyof typeof RpcSource];

export const BrokerSource = {
  USER: USER_SERVICE,
  MESSAGE: MESSAGE_SERVICE,
  FOOD: FOOD_SERVICE,
} as const;

export type BrokerSource = (typeof BrokerSource)[keyof typeof BrokerSource];
