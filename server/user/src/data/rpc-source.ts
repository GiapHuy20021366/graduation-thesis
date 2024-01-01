import { MESSAGE_SERVICE, USER_SERVICE, FOOD_SERVICE } from "../config";

export const RpcSource = {
    USER: USER_SERVICE,
    MESSAGE: MESSAGE_SERVICE,
    FOOD: FOOD_SERVICE
} as const;

export type RpcSource = typeof RpcSource[keyof typeof RpcSource];