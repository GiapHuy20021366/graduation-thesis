import {
  rpcGetDictPlaceByListId,
  rpcGetDictUserByListId,
  rpcGetPlaceById,
  rpcGetUserById,
  rpcGetUserInfo,
} from "../services";
import { RpcAction, RpcRequest, RpcResponse } from "../data";

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

export default async function consum(
  request: RpcRequest
): Promise<RpcResponse> {
  const response: RpcResponse = {};
  switch (request.action) {
    case RpcAction.USER_RPC_GET_INFO: {
      const userRequest = request as RpcRequest<IRpcGetInfoPayLoad>;
      try {
        response.data = await rpcGetUserInfo(userRequest.payload._id);
      } catch (error) {
        response.err = {
          code: 500,
          reason: "unknown",
          target: "unknown",
        };
      }

      break;
    }
    case RpcAction.USER_RPC_GET_USER_BY_ID: {
      const userRequest = request as RpcRequest<IRpcGetUserByIdPayload>;
      try {
        const { _id, select } = userRequest.payload;
        response.data = await rpcGetUserById(_id, select);
      } catch (error) {
        response.err = {
          code: 500,
          reason: "unknown",
          target: "unknown",
        };
      }
      break;
    }
    case RpcAction.USER_RPC_GET_DICT_USER_BY_LIST_ID: {
      const userRequest = request as RpcRequest<IRpcGetDictUserPayload>;
      try {
        const { _ids, select } = userRequest.payload;
        response.data = await rpcGetDictUserByListId(_ids, select);
      } catch (error) {
        response.err = {
          code: 500,
          reason: "unknown",
          target: "unknown",
        };
      }
      break;
    }
    case RpcAction.USER_RPC_GET_PLACE_BY_ID: {
      const userRequest = request as RpcRequest<IRpcGetPlaceByIdPayload>;
      try {
        const { _id, select } = userRequest.payload;
        response.data = await rpcGetPlaceById(_id, select);
      } catch (error) {
        response.err = {
          code: 500,
          reason: "unknown",
          target: "unknown",
        };
      }
      break;
    }
    case RpcAction.USER_RPC_GET_DICT_PLACE_BY_LIST_ID: {
      const userRequest = request as RpcRequest<IRpcGetDictPlacePayload>;
      try {
        const { _ids, select } = userRequest.payload;
        response.data = await rpcGetDictPlaceByListId(_ids, select);
      } catch (error) {
        response.err = {
          code: 500,
          reason: "unknown",
          target: "unknown",
        };
      }
      break;
    }
  }

  return response;
}
