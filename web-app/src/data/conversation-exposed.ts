import { IConversation } from "./conversation";

export interface IConversationExposed extends IConversation {
  _id: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
