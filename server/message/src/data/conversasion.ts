export interface IConversationParticipantMeta {
  id: string;
  joinTime: string;
  addedBy?: string;
}

export interface IConversation {
  participants: string[]; //users
  meta: IConversationParticipantMeta[];
  name?: string;
}
