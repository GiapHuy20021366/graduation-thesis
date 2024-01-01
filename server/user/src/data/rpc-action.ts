export const RpcAction = {
    USER_RPC_GET_INFO: "rpcGetUserInfo"
} as const;

export type RpcAction = typeof RpcAction[keyof typeof RpcAction];
