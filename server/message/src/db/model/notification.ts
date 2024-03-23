import { Model, Schema, model } from "mongoose";
import collections from "../collections";
import { INotification, Timed } from "../../data";

export interface INotificationSchema extends INotification, Timed {}

interface INotificationMethods {}

interface INotificationModel
  extends Model<INotificationSchema, {}, INotificationMethods> {}

const notificationSchema = new Schema<
  INotificationSchema,
  INotificationModel,
  INotificationMethods
>({
  users: {
    type: [String],
    required: true,
    index: true,
    default: [],
  },
  reads: {
    type: [String],
    required: true,
    index: true,
    default: [],
  },
  type: {
    type: Number,
    require: true,
  },

  typedFoods: {
    type: [String],
  },
  typedPlace: {
    type: String,
  },
  typedUser: {
    type: String,
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Notification = model<INotificationSchema, INotificationModel>(
  "Notification",
  notificationSchema,
  collections.notifcation
);

export default Notification;
