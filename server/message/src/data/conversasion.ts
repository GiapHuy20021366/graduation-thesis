import { Ided } from "./schemad";

export interface IConversationParticipantMeta extends Ided {
  joinTime: Date;
  addedBy?: string;
}

export interface IConversation {
  participants: string[]; //users
  meta: IConversationParticipantMeta[];
  name?: string;
}
