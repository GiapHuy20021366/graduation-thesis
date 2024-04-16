import { FOOD_SERVICE_RPC_QUEUE, MESSAGE_SERVICE_RPC_QUEUE, USER_SERVICE_RPC_QUEUE } from "../config";

export const RpcQueueName = {
    RPC_FOOD: FOOD_SERVICE_RPC_QUEUE,
    RPC_USER: USER_SERVICE_RPC_QUEUE,
    RPC_MESSAGE: MESSAGE_SERVICE_RPC_QUEUE
} as const;

export type RpcQueueName = typeof RpcQueueName[keyof typeof RpcQueueName];