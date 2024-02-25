import { Server, Socket } from "socket.io";
import { getConversation, newConversationMessage } from "../services";
import { AuthLike, IConversationMessage } from "../data";
import { IConversationSchema } from "~/db/model";

export interface ISocketServerMeta {
  socketServer: Server;
  userIdToSockets: Record<string, Socket[]>;
  socketIdToAuth: Record<string, AuthLike>;
}

const socketIdToConversationRooms: Record<string, string[]> = {};
const roomIdToConversationMeta: Record<string, IConversationSchema> = {};

const socketRoomEmitKey = {
  CONVERSATION_META: "conversation-meta",
  CONVERSATION_MESSAGE_ERROR: (conversationId?: string) => {
    if (conversationId) {
      return `Conversation@${conversationId}-message-error`;
    } else {
      return "conversation-message-error";
    }
  }, // when a message sent is error,
  CONVERSATION_NEW_MESSAGE: (conversationId?: string) => {
    if (conversationId) {
      return `Conversation@${conversationId}-new-message`;
    } else {
      return "conversation-new-message";
    }
  },
} as const;

const toConversationRoom = (conversationId: string) => {
  return "Conversation@" + conversationId;
};

export const joinConversation = (
  client: Socket,
  conversationId: string,
  meta: ISocketServerMeta
): Promise<IConversationSchema> => {
  const conversationRoom = toConversationRoom(conversationId);

  const conversationRooms = socketIdToConversationRooms[client.id];
  const auth = meta.socketIdToAuth[client.id];

  if (
    conversationRooms == null ||
    !conversationRooms.includes(conversationRoom)
  ) {
    return getConversation(conversationId, auth._id).then((data) => {
      roomIdToConversationMeta[conversationId] = data;

      client.join(conversationRoom);
      if (conversationRoom == null) {
        socketIdToConversationRooms[client.id] = [conversationRoom];
      } else {
        socketIdToConversationRooms[client.id].push(conversationRoom);
      }

      // Emit to client to know their joined conversation
      client.emit(socketRoomEmitKey.CONVERSATION_META, data);
      return data;
    });
  } else {
    const meta = roomIdToConversationMeta[conversationId];
    // Emit to client to know their joined conversation
    client.emit(socketRoomEmitKey.CONVERSATION_META, meta);
    return Promise.resolve(meta);
  }
};

export const leaveConversation = (
  client: Socket,
  conversationId: string,
  meta: ISocketServerMeta
) => {
  const room = toConversationRoom(conversationId);
  client.leave(room);
  const sockets = meta.socketServer.sockets.adapter.rooms.get(room);
  if (sockets == null || sockets.size === 0) {
    if (roomIdToConversationMeta[room]) {
      delete roomIdToConversationMeta[room];
    }
  }
  const joinedRooms = socketIdToConversationRooms[client.id];
  if (joinedRooms != null && joinedRooms.includes(room)) {
    const index = joinedRooms.indexOf(room);
    if (index !== -1) {
      joinedRooms.splice(index, 1);
    }
    if (joinedRooms.length === 0) {
      delete socketIdToConversationRooms[client.id];
    }
  }
};

export const leaveAllConversations = (
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
  client: Socket,
  conversationId: string,
  uuid: string,
  message: IConversationMessage,
  meta: ISocketServerMeta
) => {
  const conversationRoom = toConversationRoom(conversationId);
  // Join this conversation first
  joinConversation(client, conversationId, meta).then(
    (conversationMeta): void => {
      newConversationMessage(message)
        .then((messageExposed) => {
          const participants = conversationMeta.participants;

          const listenedSockets =
            meta.socketServer.sockets.adapter.rooms.get(conversationRoom);
          const listenedUsers: string[] = [];
          listenedSockets?.forEach((socketId) => {
            const auth = meta.socketIdToAuth[socketId];
            const userId = auth._id;
            if (!listenedUsers.includes(userId)) {
              listenedUsers.push(userId);
            }
          });

          // Emit to participants that not in room but currently online
          if (participants.length !== listenedUsers.length) {
            participants.forEach((participant) => {
              const sockets = meta.userIdToSockets[participant];
              if (sockets == null) return;

              if (!listenedUsers.includes(participant)) {
                sockets.forEach((socket) => {
                  socket.emit(
                    socketRoomEmitKey.CONVERSATION_META,
                    conversationMeta
                  );
                  socket.emit(
                    socketRoomEmitKey.CONVERSATION_NEW_MESSAGE(),
                    uuid,
                    message
                  );
                });
              }
              sockets.forEach((socket) =>
                socket.emit(
                  socketRoomEmitKey.CONVERSATION_NEW_MESSAGE(conversationId),
                  uuid,
                  messageExposed
                )
              );
            });
          }
        })
        .catch((_error) => {
          client.emit(
            socketRoomEmitKey.CONVERSATION_MESSAGE_ERROR(conversationId),
            uuid
          );
        });
    }
  );
};
