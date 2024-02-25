import { IConversationSchema } from "../db/model";

export interface IConversationExposed extends IConversationSchema {
  _id: string;
}
