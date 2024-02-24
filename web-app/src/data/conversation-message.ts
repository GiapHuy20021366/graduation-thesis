import { ILocation } from "./location";

export const ConversationMessageType = {
  TEXT: "TEXT",
  LINK: "LINK",
  IMAGE: "CONTEXT",
  LOCATION: "LOCATION",
  REACTION: "REACTION",
  CONTEXT: "CONTEXT",
} as const;

export type ConversationMessageType =
  (typeof ConversationMessageType)[keyof typeof ConversationMessageType];

export const ConversationMessageContextType = {
  FROM_FOOD_POST: "FROM_FOOD_POST",
  FROM_PLACE: "FROM_PLACE",
  FROM_PERSONAL: "FROM_PERSONAL",
  FROM_LINK: "FROM_LINK",
};

export type ConversationMessageContextType =
  (typeof ConversationMessageContextType)[keyof typeof ConversationMessageContextType];

export interface IConversationMessageReaction {
  target: string; // target message
  emoji: string; // emoji
}

export interface IConversationMessageContext {
  type: ConversationMessageContextType;
  source?: string;
  link?: string;
}

export interface IConversationMessage {
  type: ConversationMessageType;
  conversation: string; // conservation
  sender: string; // user

  textContent?: string; // for text message type
  linkContent?: string; // for link message type
  imageContent?: string; // for image message type: url of image
  locationContent?: ILocation; // for location message type
  reactionContent?: IConversationMessageReaction; // for reaction message type
  contextContent?: IConversationMessageContext; // for context message type
}
