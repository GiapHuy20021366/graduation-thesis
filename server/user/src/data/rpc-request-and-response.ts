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

export interface RpcResponse<Err extends RpcResponseErr = RpcResponseErr, T = any> {
    err?: Err;
    data?: T;
}