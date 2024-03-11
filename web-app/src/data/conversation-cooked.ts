import { IConversationExposed } from "./conversation-exposed";
import { IConversationMessageCooked } from "./conversation-message-cooked";

export interface IConversationParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
}

export interface IConversationCooked
  extends Omit<IConversationExposed, "participants"> {
  messages?: IConversationMessageCooked[];
  participants: IConversationParticipant[];
}
