export interface IConversationParticipantMeta {
  id: string;
  joinTime: string;
  addedBy?: string;
}

export interface IConversation {
  _id: string;
  participants: string[]; //users
  meta: IConversationParticipantMeta[];
  name?: string;
}
