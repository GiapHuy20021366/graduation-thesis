import { Server, Socket } from "socket.io";
import { getConversation } from "../services";
import { AuthLike, IConversationMessage } from "../data";
import { IConversationSchema } from "~/db/model";

export interface ISocketServerMeta {
  socketServer: Server;
  userIdToSockets: Record<string, Socket[]>;
  socketIdToAuth: Record<string, AuthLike>;
}

const socketIdToConversationRooms: Record<string, string[]> = {};
const roomIdToConversationMeta: Record<string, IConversationSchema> = {};

const toConversationRoom = (conversationId: string) => {
  return "Conversation@" + conversationId;
};

export const joinConversation = (
  client: Socket,
  conversationId: string,
  meta: ISocketServerMeta
) => {
  const conversationRoom = toConversationRoom(conversationId);

  const conversationRooms = socketIdToConversationRooms[client.id];
  const auth = meta.socketIdToAuth[client.id];

  if (
    conversationRooms == null ||
    !conversationRooms.includes(conversationRoom)
  ) {
    getConversation(conversationId, auth._id).then((data) => {
      roomIdToConversationMeta[conversationId] = data;

      client.join(conversationRoom);
      if (conversationRoom == null) {
        socketIdToConversationRooms[client.id] = [conversationRoom];
      } else {
        socketIdToConversationRooms[client.id].push(conversationRoom);
      }
    });
  }
};

export const outAllConversations = (
  client: Socket,
  meta: ISocketServerMeta
) => {
  const rooms = socketIdToConversationRooms[client.id];
  if (rooms != null && 0 < rooms.length) {
    rooms.forEach((room) => {
      client.leave(room);

      const sockets = meta.socketServer.sockets.adapter.rooms.get(room);
      if (sockets == null || sockets.size === 0) {
        if (roomIdToConversationMeta[room] != null) {
          delete roomIdToConversationMeta[room];
        }
      }
    });
  }
  if (socketIdToConversationRooms[client.id]) {
    delete socketIdToConversationRooms[client.id];
  }
};

export const sendMessageToConversation = (
  message: IConversationMessage,
  conversationId: string,
  meta: ISocketServerMeta
) => {
  // Todo
};
