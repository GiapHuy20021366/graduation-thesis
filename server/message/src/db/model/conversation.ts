import { Model, Schema, model } from "mongoose";
import collections from "../collections";
import { IConversation, Timed } from "../../data";

export interface IConversationSchema extends IConversation, Timed {}

interface IConversationMethods {}

interface IConversationModel
  extends Model<IConversationSchema, {}, IConversationMethods> {}

const conversationSchema = new Schema<
  IConversationSchema,
  IConversationModel,
  IConversationMethods
>({
  participants: {
    type: [String],
    required: true,
    index: true,
  },
  meta: [
    {
      _id: {
        type: String,
        required: true,
        index: true,
      },
      joinTime: {
        type: Date,
        default: Date.now,
      },
      addedBy: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

export const Conversation = model<IConversationSchema, IConversationModel>(
  "Conversation",
  conversationSchema,
  collections.conversation
);

export default Conversation;
