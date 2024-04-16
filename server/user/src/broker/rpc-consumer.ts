import {
  rpcGetDictPlaceByListId,
  rpcGetDictUserByListId,
  rpcGetPlaceById,
  rpcGetUserById,
  rpcGetUserInfo,
  rpcGetRegistersByUserId,
  rpcGetRatedScoresByUserId,
} from "../services";
import { RabbitMQ } from "./rpc";
import { RpcRequest } from "./rpc-request-and-response";

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

export const initRpcConsumers = (rabbit: RabbitMQ): void => {
  rabbit.listenRpc(
    RpcAction.USER_RPC_GET_INFO,
    (req: RpcRequest<IRpcGetInfoPayLoad>) => {
      return rpcGetUserInfo(req.payload._id);
    }
  );

  rabbit.listenRpc(
    RpcAction.USER_RPC_GET_USER_BY_ID,
    (req: RpcRequest<IRpcGetUserByIdPayload>) => {
      const { _id, select } = req.payload;
      return rpcGetUserById(_id, select);
    }
  );

  rabbit.listenRpc(
    RpcAction.USER_RPC_GET_DICT_USER_BY_LIST_ID,
    (req: RpcRequest<IRpcGetDictUserPayload>) => {
      const { _ids, select } = req.payload;
      return rpcGetDictUserByListId(_ids, select);
    }
  );

  rabbit.listenRpc(
    RpcAction.USER_RPC_GET_PLACE_BY_ID,
    (req: RpcRequest<IRpcGetPlaceByIdPayload>) => {
      const { _id, select } = req.payload;
      return rpcGetPlaceById(_id, select);
    }
  );

  rabbit.listenRpc(
    RpcAction.USER_RPC_GET_DICT_PLACE_BY_LIST_ID,
    (req: RpcRequest<IRpcGetDictPlacePayload>) => {
      const { _ids, select } = req.payload;
      return rpcGetDictPlaceByListId(_ids, select);
    }
  );

  rabbit.listenRpc(
    RpcAction.USER_RPC_GET_REGISTERS_BY_USER_ID,
    (req: RpcRequest<IRpcGetRegistersPayload>) => {
      const { userId } = req.payload;
      return rpcGetRegistersByUserId(userId);
    }
  );

  rabbit.listenRpc(
    RpcAction.USER_RPC_GET_RATED_SCORES_BY_USER_ID,
    (req: RpcRequest<IRpcGetRatedScoresPayload>) => {
      const { userId } = req.payload;
      return rpcGetRatedScoresByUserId(userId);
    }
  );
};

export const initBrokerConsumners = (_rabbit: RabbitMQ): void => {
  // Do nothing
};
