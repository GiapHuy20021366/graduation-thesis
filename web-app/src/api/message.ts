import axios from "axios";
import { PROXY_URL, MESSAGE_PATH } from "../env";
import {
  IAuthInfo,
  IConversationExposed,
  IConversationMessageExposed,
  INotificationExposed,
  IPagination,
  NotificationType,
  ResponseErrorLike,
  ResponseLike,
  UserErrorReason,
  UserErrorTarget,
  durations,
} from "../data";

export const messageEndpoints = {
  createConversation: "/conversations",
  getConversation: "/conversations/:id",
  getConversations: "/conversations",
  getConversationMessages: "/conversations/:id/messages",
  getNotifications: "/notifications",
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

  getNotifications: (
    latestTime: number,
    limit: number,
    auth: IAuthInfo
  ) => Promise<MessageResponse<INotificationExposed[]>>;
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

  getNotifications: (
    before: number,
    limit: number,
    auth: IAuthInfo
  ): Promise<MessageResponse<INotificationExposed[]>> => {
    console.log(before, limit, auth);
    return Promise.resolve({
      data: fakeNotification(),
    });
  },
};

const fakeNotification = (): INotificationExposed[] => {
  const result: INotificationExposed[] = [];

  const current = Date.now();
  const types = Object.values(NotificationType);
  let idx = 0;
  types.forEach((type) => {
    const limit = [
      NotificationType.FOOD_EXPIRED,
      NotificationType.FOOD_NEAR_EXPIRED,
      NotificationType.FOOD_SUBCRIBED_PLACE,
      NotificationType.FOOD_SUBCRIBED_USER,
      NotificationType.FOOD_SUGGESTED_AROUND,
      NotificationType.FOOD_SUGGESTED_CATEGORY,
    ].includes(type)
      ? 50
      : 5;
    for (let i = 0; i < limit; ++i) {
      const time = current - durations.TEN_MINUTES * i - idx * 1000;
      result.push({
        user: "123",
        _id: String(Date.now() + ++idx),
        createdAt: new Date(time),
        updatedAt: new Date(time),
        read: false,
        type: type,
        typedFoods: ["1", "2", "3"],
        typedPlace: "123",
        typedUser: "123",
      });
    }
  });

  return result;
};
