import { Server, Socket } from "socket.io";
import {
  joinConversation,
  leaveConversation,
  leaveAllConversations,
  sendMessageToConversation,
} from "./conversation";
import { verifyToken } from "../utils";
import { AuthLike, IConversationMessage, INotificationExposed } from "../data";
import { consoleLogger } from "../config";
import { readNotifications, sendNotification } from "./notification";

const socketOnKey = {
  CONVERSATION_JOIN: "conversation-join",
  CONVERSATION_LEAVE: "conversation-leave",
  CONVERSATION_SEND_MESSAGE: "conversation-send-message",
  READ_NOTIFICATION: "read-notification",
} as const;

let socketServer: Server | null = null;
const userIdToSockets: Record<string, Socket[]> = {};
const socketIdToAuth: Record<string, AuthLike> = {};

export const onClientConnected = (auth: AuthLike, client: Socket) => {
  const user = auth._id;

  consoleLogger.info(
    "[SOCKET] [CONNECTED]",
    "A user with id",
    auth._id,
    "and email",
    auth.email,
    "connected"
  );

  if (userIdToSockets[user] == null) {
    userIdToSockets[user] = [client];
  }
  userIdToSockets[user].push(client);
  socketIdToAuth[client.id] = auth;
};

export const onClientDisconnected = (auth: AuthLike, client: Socket) => {
  const user = auth._id;
  consoleLogger.info(
    "[SOCKET] [DISCONNECTED]",
    "A user with id",
    auth._id,
    "and email",
    auth.email,
    "disconnected"
  );
  const sockets = userIdToSockets[user];
  if (sockets != null) {
    const index = sockets.indexOf(client);
    if (index !== -1) {
      sockets.splice(index, 1);
    }
  }
  if (socketIdToAuth[client.id] != null) {
    delete socketIdToAuth[client.id];
  }
};

const initSocketListener = (socketServer: Server) => {
  socketServer.on("connection", (socket: Socket) => {
    // Verified
    const authorization = socket.request.headers.authorization;
    if (authorization == null) return;
    const verified = verifyToken(authorization);
    if (verified == null || typeof verified === "string") return;
    const auth = verified.data as AuthLike;

    onClientConnected(auth, socket);

    // join a conversation
    socket.on(socketOnKey.CONVERSATION_JOIN, (conversationId: string) => {
      joinConversation(socket, conversationId, {
        socketServer,
        userIdToSockets,
        socketIdToAuth,
      });
    });

    // send a message
    socket.on(
      socketOnKey.CONVERSATION_SEND_MESSAGE,
      (conversationId: string, uuid: string, message: IConversationMessage) => {
        sendMessageToConversation(socket, conversationId, uuid, message, {
          socketServer,
          userIdToSockets,
          socketIdToAuth,
        });
      }
    );

    // leave a conversation
    socket.on(socketOnKey.CONVERSATION_LEAVE, (conversationId: string) => {
      leaveConversation(socket, conversationId, {
        socketServer,
        userIdToSockets,
        socketIdToAuth,
      });
    });

    // read notification
    socket.on(socketOnKey.READ_NOTIFICATION, (notificationIds: string[]) => {
      readNotifications(auth._id, notificationIds, userIdToSockets[auth._id]);
    });

    // disconnected
    socket.on("disconnect", () => {
      leaveAllConversations(socket, {
        socketServer,
        userIdToSockets,
        socketIdToAuth,
      });
      onClientDisconnected(auth, socket);
    });
  });
};

export const initSocketServer = (server: any) => {
  if (socketServer == null) {
    socketServer = new Server(server, {
      cors: {
        origin: "*",
      },
    });
    initSocketListener(socketServer);
  }
  return socketServer;
};

export const sendNotificationToUsers = (
  users: string[],
  notification: INotificationExposed
) => {
  users.forEach((user) => {
    const sockets = userIdToSockets[user];
    if (sockets) {
      sendNotification(sockets, notification);
    }
  });
};
