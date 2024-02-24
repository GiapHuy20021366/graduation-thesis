import { Server, Socket } from "socket.io";
import { joinConversation, outAllConversations } from "./conversation";
import { verifyToken } from "../utils";
import { AuthLike } from "../data";

const socketOnKey = {
  CONVERSATION_JOIN: "conversation-join",
  CONVERSATION_LEAVE: "conversation-leave",
  CONVERSATION_SEND_MESSAGE: "conversation-send-message",
} as const;

const socketEmitKey = {} as const;

let socketServer: Server | null = null;
const userIdToSockets: Record<string, Socket[]> = {};
const socketIdToAuth: Record<string, AuthLike> = {};

export const onClientConnected = (auth: AuthLike, client: Socket) => {
  const user = auth._id;
  if (userIdToSockets[user] == null) {
    userIdToSockets[user] = [client];
  }
  userIdToSockets[user].push(client);
  socketIdToAuth[client.id] = auth;
};

export const onClientDisconnected = (auth: AuthLike, client: Socket) => {
  const user = auth._id;
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

    onClientConnected(verified as AuthLike, socket);

    // join a conversation
    socket.on(socketOnKey.CONVERSATION_JOIN, (conversationId: string) => {
      joinConversation(socket, conversationId, {
        socketServer,
        userIdToSockets,
        socketIdToAuth,
      });
    });

    // disconnected
    socket.on("disconnect", () => {
      outAllConversations(socket, {
        socketServer,
        userIdToSockets,
        socketIdToAuth,
      });
      onClientDisconnected(verified as AuthLike, socket);
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
