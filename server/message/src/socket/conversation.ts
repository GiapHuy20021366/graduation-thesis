import { Server, Socket } from "socket.io";
import { ISocketAuth } from "./socket-auth";

export interface IConversationMeta {
  _id: string;
  name?: string;
  participants: string[];
  createdAt: Date;
}

export interface ISocketServerMeta {
  server: Server;
  userIdToSockets: Record<string, Socket[]>;
  socketIdToAuths: Record<string, ISocketAuth>;
}

const socketIdToConversations: Record<string, string> = {};

export const joinConversation = (
  client: Socket,
  conversation: string,
  _meta: ISocketServerMeta
) => {
  if (socketIdToConversations[client.id] != null) return;

  client.join(conversation);
};
