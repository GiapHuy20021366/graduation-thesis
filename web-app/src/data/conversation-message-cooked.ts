import { IConversationParticipant } from "./conversation-cooked";
import { IConversationMessageExposed } from "./conversation-message-exposed";

export interface IConversationMessageCooked
  extends Omit<IConversationMessageExposed, "sender"> {
  sender?: IConversationParticipant;
}
