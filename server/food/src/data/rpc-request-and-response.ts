import { RpcAction } from "./rpc-action";
import { RpcSource } from "./rpc-source";

export interface RpcRequest<T = any> {
    source: RpcSource;
    action: RpcAction;
    payload: T;
}

export interface RpcResponseErr {
    code: number;
    target: string;
    reason: string;
    msg?: string;
}

export interface RpcResponse<T = any> {
    err?: RpcResponseErr;
    data?: T;
}