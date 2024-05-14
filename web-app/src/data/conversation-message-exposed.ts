import { IConversationMessage } from "./conversation-message";

export interface IConversationMessageExposed extends IConversationMessage {
  _id: string;
  createdAt: string | Date; // time
  updatedAt: string | Date;
}
