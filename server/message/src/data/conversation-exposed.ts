import { IConversationSchema } from "../db/model";
import { Ided } from "./schemad";

export interface IConversationExposed extends IConversationSchema, Ided {}
