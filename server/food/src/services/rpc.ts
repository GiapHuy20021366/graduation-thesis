import { RPCRequest } from "~/broker";
import {
  IRpcGetUserByIdPayload,
  PlaceType,
  RpcAction,
  RpcQueueName,
  RpcRequest,
  RpcSource,
} from "../data";

export interface IPlaceIdAndType {
  _id: string;
  type: PlaceType;
}

export interface Id {
  _id: string;
}

export const rpcGetUser = async <T>(
  user?: string,
  select?: string | string[]
): Promise<T | null> => {
  if (user == null) return null;
  const rpcUserRequest: RpcRequest<IRpcGetUserByIdPayload> = {
    source: RpcSource.FOOD,
    action: RpcAction.USER_RPC_GET_USER_BY_ID,
    payload: {
      _id: user,
      select: select,
    },
  };
  const response = await RPCRequest<T>(RpcQueueName.RPC_USER, rpcUserRequest);
  if (response == null || response.data == null) return null;
  return response.data;
};

export const rpcGetPlace = async <T>(
  place?: string,
  select?: string | string[]
): Promise<T | null> => {
  if (place == null) return null;
  const rpcPlaceRequest: RpcRequest<IRpcGetUserByIdPayload> = {
    source: RpcSource.FOOD,
    action: RpcAction.USER_RPC_GET_PLACE_BY_ID,
    payload: {
      _id: place,
      select: select,
    },
  };
  const response = await RPCRequest<T>(RpcQueueName.RPC_USER, rpcPlaceRequest);
  if (response == null || response.data == null) return null;
  return response.data;
};
