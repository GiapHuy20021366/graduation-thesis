import { Socket } from "socket.io";
import { AuthLike, INotificationExposed } from "../data";

export const toNotificationChannel = (userId: string) => {
  return `Notification@${userId}`;
};

export const joinNotificationChannel = (
  socket: Socket,
  auth: AuthLike
) => {
  const channel = toNotificationChannel(auth._id);
  socket.join(`Notification@${channel}`);
};

export const sendNotification = (
  sockets: Socket[],
  notification: INotificationExposed
) => {
  sockets.forEach((socket) => socket.emit("new-notification", notification));
};
