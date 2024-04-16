import {
  IRpcGetDictPlacePayload,
  IRpcGetDictUserPayload,
  IRpcGetPlaceByIdPayload,
  IRpcGetRatedScoresPayload,
  IRpcGetRegistersPayload,
  IRpcGetUserByIdPayload,
  RabbitMQ,
  RpcAction,
  RpcQueueName,
  RpcRequest,
  RpcSource,
} from "../broker";
import { ILocation, PlaceType } from "../data";

export interface IPlaceIdAndType {
  _id: string;
  type: PlaceType;
}

export interface Id {
  _id: string;
}

export interface ICategories {
  categories: string[];
}

export interface IdAndLocationAndCategories extends Id, ICategories {
  location?: ILocation;
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
  const response = await RabbitMQ.instance.requestData<T>(
    RpcQueueName.RPC_USER,
    rpcUserRequest
  );
  if (response == null || response.data == null) return null;
  return response.data;
};

export const rpcGetPlace = async <T>(
  place?: string,
  select?: string | string[]
): Promise<T | null> => {
  if (place == null) return null;
  const rpcPlaceRequest: RpcRequest<IRpcGetPlaceByIdPayload> = {
    source: RpcSource.FOOD,
    action: RpcAction.USER_RPC_GET_PLACE_BY_ID,
    payload: {
      _id: place,
      select: select,
    },
  };
  const response = await RabbitMQ.instance.requestData<T>(
    RpcQueueName.RPC_USER,
    rpcPlaceRequest
  );
  if (response == null || response.data == null) return null;
  return response.data;
};

export const rpcGetDictPlace = async <T>(
  places?: string[],
  select?: string | string[]
): Promise<T | null> => {
  if (places == null || places.length === 0) return null;
  const rpcPlaceRequest: RpcRequest<IRpcGetDictPlacePayload> = {
    source: RpcSource.FOOD,
    action: RpcAction.USER_RPC_GET_DICT_PLACE_BY_LIST_ID,
    payload: {
      _ids: places,
      select: select,
    },
  };
  const response = await RabbitMQ.instance.requestData<T>(
    RpcQueueName.RPC_USER,
    rpcPlaceRequest
  );
  if (response == null || response.data == null) return null;
  return response.data;
};

export const rpcGetDictUser = async <T>(
  users?: string[],
  select?: string | string[]
): Promise<T | null> => {
  if (users == null || users.length === 0) return null;
  const rpcPlaceRequest: RpcRequest<IRpcGetDictUserPayload> = {
    source: RpcSource.FOOD,
    action: RpcAction.USER_RPC_GET_DICT_USER_BY_LIST_ID,
    payload: {
      _ids: users,
      select: select,
    },
  };
  const response = await RabbitMQ.instance.requestData<T>(
    RpcQueueName.RPC_USER,
    rpcPlaceRequest
  );
  if (response == null || response.data == null) return null;
  return response.data;
};

export const rpcGetRegisters = async <T>(userId: string): Promise<T | null> => {
  const rpcPlaceRequest: RpcRequest<IRpcGetRegistersPayload> = {
    source: RpcSource.FOOD,
    action: RpcAction.USER_RPC_GET_REGISTERS_BY_USER_ID,
    payload: {
      userId: userId,
    },
  };
  const response = await RabbitMQ.instance.requestData<T>(
    RpcQueueName.RPC_USER,
    rpcPlaceRequest
  );
  if (response == null || response.data == null) return null;
  return response.data;
};

export const rpcGetRatedScores = async <T>(
  userId: string
): Promise<T | null> => {
  const rpcPlaceRequest: RpcRequest<IRpcGetRatedScoresPayload> = {
    source: RpcSource.FOOD,
    action: RpcAction.USER_RPC_GET_RATED_SCORES_BY_USER_ID,
    payload: {
      userId: userId,
    },
  };
  const response = await RabbitMQ.instance.requestData<T>(
    RpcQueueName.RPC_USER,
    rpcPlaceRequest
  );
  if (response == null || response.data == null) return null;
  return response.data;
};
