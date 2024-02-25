import { IConversationMessageSchema } from "../db/model";

export interface IConversationMessageExposed
  extends IConversationMessageSchema {
  _id: string;
}
