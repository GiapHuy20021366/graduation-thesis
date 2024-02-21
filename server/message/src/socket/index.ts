import { Server, Socket } from "socket.io";
import { ISocketAuth } from "./socket-auth";
import { GATEWAY_HOST, WEB_APP_HOST } from "../config";

let socketServer: Server | null = null;
const userIdToSockets: Record<string, Socket[]> = {};
const socketIdToAuths: Record<string, ISocketAuth> = {};

export const addClient = (user: string, client: Socket) => {
  if (userIdToSockets[user] == null) {
    userIdToSockets[user] = [client];
  }
  userIdToSockets[user].push(client);
};

export const authClient = (client: Socket, auth: ISocketAuth) => {
  socketIdToAuths[client.id] = auth;
};

const initSocketListener = (socketServer: Server) => {
  // init listener
  socketServer.on("connection", (socket: Socket) => {
    console.log("A user connected");

    // Bắt sự kiện khi client gửi tin nhắn
    socket.on("message", (message: string) => {
      console.log(`Received message: ${message}`);

      // Gửi tin nhắn đến tất cả các client
      socketServer.emit("message", `Server: ${message}`);
    });

    // Bắt sự kiện khi người dùng ngắt kết nối
    socket.on("disconnect", () => {
      console.log("User disconnected");
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
