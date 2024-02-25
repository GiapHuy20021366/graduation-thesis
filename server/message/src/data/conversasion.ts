export interface IConversationParticipantMeta {
  id: string;
  joinTime: Date;
  addedBy?: string;
}

export interface IConversation {
  participants: string[]; //users
  meta: IConversationParticipantMeta[];
  name?: string;
}