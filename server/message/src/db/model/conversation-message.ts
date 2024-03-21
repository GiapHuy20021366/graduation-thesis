import { Model, Schema, model } from "mongoose";
import collections from "../collections";
import { IConversationMessage, Timed } from "../../data";

export interface IConversationMessageSchema
  extends Omit<IConversationMessage, "conversation">,
    Timed {
  conversation: Schema.Types.ObjectId;
}

interface IConversationMessageMethods {}

interface IConversationMessageModel
  extends Model<IConversationMessageSchema, {}, IConversationMessageMethods> {}

const conversationMessageSchema = new Schema<
  IConversationMessageSchema,
  IConversationMessageModel,
  IConversationMessageMethods
>({
  type: {
    type: String,
    require: true,
  },
  conversation: {
    type: Schema.ObjectId,
    ref: "Conversation",
    required: true,
    index: true,
  },
  imageContent: String,
  linkContent: String,
  contextContent: {
    type: String,
    source: String,
    link: String,
  },
  locationContent: {
    name: String,
    coordinates: {
      lat: Number,
      lng: Number,
    },
  },
  reactionContent: {
    target: {
      type: Schema.ObjectId,
      ref: "ConversationMessage",
    },
    emoji: String,
  },
  sender: String,
  textContent: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const ConversationMessage = model<
  IConversationMessageSchema,
  IConversationMessageModel
>(
  "ConversationMessage",
  conversationMessageSchema,
  collections.conversationMessage
);

export default ConversationMessage;
