import { Socket } from "socket.io";
import { INotificationExposed } from "../data";
import { Notification } from "../db/model";

const socketNotificationEmitKey = {
  NEW_NOTIFICATION: "new-notification",
  READ_NOTIFICATION: "read-notification",
} as const;

export const toNotificationChannel = (userId: string) => {
  return `Notification@${userId}`;
};

export const sendNotification = (
  sockets: Socket[],
  notification: INotificationExposed
) => {
  sockets.forEach((socket) =>
    socket.emit(socketNotificationEmitKey.NEW_NOTIFICATION, notification)
  );
};

export const readNotifications = async (
  userId: string,
  notificationIds: string[],
  sockets: Socket[]
) => {
  if (notificationIds.length > 0) {
    const notifications = await Notification.find({
      _id: {
        $in: notificationIds,
      },
      reads: {
        $nin: [userId],
      },
    });
    notifications.forEach((n) => n.reads.push(userId));
    Promise.all(notifications.map((n) => n.save()));
    sockets.forEach((s) =>
      s.emit(
        socketNotificationEmitKey.READ_NOTIFICATION,
        notifications.map((n) => n._id.toString())
      )
    );
    /**
     * Temp
     */
    sockets.forEach((s) =>
      s.emit(socketNotificationEmitKey.READ_NOTIFICATION, notificationIds)
    );
  }
};
