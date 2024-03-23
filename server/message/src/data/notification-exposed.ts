import { HydratedDocument } from "mongoose";
import { INotificationSchema } from "../db/model";
import { Ided } from "./schemad";

export interface INotificationExposed
  extends Omit<INotificationSchema, "users" | "reads">,
    Ided {
  user: string;
  read: boolean;
}

export const toNotificationExposed = (
  notification: HydratedDocument<INotificationSchema>,
  targetUser: string
): INotificationExposed => {
  return {
    _id: notification._id.toString(),
    createdAt: notification.createdAt,
    updatedAt: notification.updatedAt,
    read: notification.reads.includes(targetUser),
    type: notification.type,
    typedFoods: notification.typedFoods,
    typedPlace: notification.typedPlace,
    typedUser: notification.typedUser,
    user: targetUser,
  };
};
