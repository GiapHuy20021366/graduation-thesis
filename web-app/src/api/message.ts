import axios from "axios";
import { PROXY_URL, MESSAGE_PATH } from "../env";
import {
  IAuthInfo,
  IConversationExposed,
  IConversationMessageExposed,
  IPagination,
  ResponseErrorLike,
  ResponseLike,
  UserErrorReason,
  UserErrorTarget,
} from "../data";

export const messageEndpoints = {
  createConversation: "/conversations",
  getConversation: "/conversations/:id",
  getConversations: "/conversations",
  getConversationMessages: "/conversations/:id/messages",
} as const;

export interface MessageResponseError
  extends ResponseErrorLike<UserErrorTarget, UserErrorReason> {}

export interface MessageResponse<DataLike>
  extends ResponseLike<DataLike, MessageResponseError> {}

const messageUrl = `${PROXY_URL}/${MESSAGE_PATH}`;

export const messageInstance = axios.create({
  baseURL: messageUrl,
  timeout: 2000,
});

messageInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errInfo = error?.response?.data?.error;
    if (errInfo != null) return Promise.reject(errInfo);
    else Promise.reject(error);
  }
);

export interface MessageFetcher {
  getConversation: (
    id: string,
    auth: IAuthInfo
  ) => Promise<MessageResponse<IConversationExposed>>;

  getConversations: (
    pagination: IPagination,
    auth: IAuthInfo
  ) => Promise<MessageResponse<IConversationExposed[]>>;

  getConversationMessages: (
    id: string,
    from: number,
    to: number,
    auth: IAuthInfo
  ) => Promise<MessageResponse<IConversationMessageExposed[]>>;

  createConversation: (
    to: string,
    auth: IAuthInfo
  ) => Promise<MessageResponse<IConversationExposed>>;
}

export const messageFetcher: MessageFetcher = {
  createConversation: (
    to: string,
    auth: IAuthInfo
  ): Promise<MessageResponse<IConversationExposed>> => {
    return messageInstance.put(
      messageEndpoints.createConversation + "?to=" + to,
      {},
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },

  getConversation: (
    id: string,
    auth: IAuthInfo
  ): Promise<MessageResponse<IConversationExposed>> => {
    return messageInstance.get(
      messageEndpoints.getConversation.replace(":id", id),
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },

  getConversations: (
    pagination: IPagination,
    auth: IAuthInfo
  ): Promise<MessageResponse<IConversationExposed[]>> => {
    return messageInstance.post(
      messageEndpoints.getConversations,
      { pagination },
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },

  getConversationMessages: (
    id: string,
    from: number,
    to: number,
    auth: IAuthInfo
  ): Promise<MessageResponse<IConversationMessageExposed[]>> => {
    return messageInstance.get(
      messageEndpoints.getConversationMessages.replace(":id", id) +
        `?from=${from}&to=${to}`,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
};
