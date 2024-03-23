import { INotificationSchema } from "~/db/model";
import { Ided } from "./schemad";

export interface INotificationExposed extends INotificationSchema, Ided {}
