import { sendNotificationToUsers } from "../socket";
import { IBrokerNotifyNewFoodPayloadFood } from "../broker";
import {
  INotification,
  INotificationExposed,
  InternalError,
  NotificationType,
  toNotificationExposed,
} from "../data";
import { Notification } from "../db/model";

export const getNotifications = async (
  userId: string,
  from: number,
  to: number,
  limit: number
): Promise<INotificationExposed[]> => {
  const notifications = await Notification.find({
    users: {
      $in: [userId],
    },
    createdAt: {
      $gt: from,
      $lt: to,
    },
  })
    .limit(limit)
    .exec();

  if (notifications == null) {
    throw new InternalError();
  }
  return notifications.map((n) => toNotificationExposed(n, userId));
};

export const createNewFoodNotifications = async (
  food: IBrokerNotifyNewFoodPayloadFood,
  subcribers: string[]
) => {
  const notificationData: INotification = {
    users: subcribers,
    reads: [],
    type: food.place
      ? NotificationType.FOOD_SUBCRIBED_PLACE
      : NotificationType.FOOD_SUBCRIBED_USER,
    typedFoods: [food._id],
    typedPlace: food.place,
    typedUser: food.user,
  };
  const notification = new Notification(notificationData);
  await notification.save();
  sendNotificationToUsers(
    subcribers.filter((s) => s !== food.user),
    notification
  );
};

export const createAroundFoodNotifications = async (
  foods: string[],
  users: string[]
) => {
  const notificationData: INotification = {
    users: users,
    reads: [],
    type: NotificationType.FOOD_SUGGESTED_AROUND,
    typedFoods: foods,
  };
  const notification = new Notification(notificationData);
  await notification.save();
  sendNotificationToUsers(users, notification);
};
