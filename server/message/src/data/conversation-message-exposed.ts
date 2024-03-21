import { IConversationMessageSchema } from "../db/model";
import { Ided } from "./schemad";

export interface IConversationMessageExposed
  extends IConversationMessageSchema,
    Ided {}
