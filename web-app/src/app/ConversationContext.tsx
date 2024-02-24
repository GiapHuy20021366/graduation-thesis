import React, { createContext, useEffect, useRef } from "react";
import {
  IConversationCooked,
  IConversationExposed,
  IConversationMessageCooked,
  IConversationMessageExposed,
} from "../data";
import { useSocketContext, useUserResolver } from "../hooks";

interface IConversationContextProviderProps {
  children?: React.ReactNode;
}

interface IConversationContext {
  conversations: Record<string, IConversationCooked>;

  /**
   * Push a message to conversations meta datas
   * @param message
   * @returns
   */
  doPushMessage: (message: IConversationMessageExposed) => void;

  /**
   * Join a conversation, it can existed or not
   * @param user
   * @returns
   */
  doBeginConversationWith: (user: string) => void;

  /**
   * Open an existed conversation;
   * @param conversation
   * @returns
   */
  doOpenConversation: (conversation: string) => void;

  doLoadConversations?: () => void;
}

export const ConversationContext = createContext<IConversationContext>({
  conversations: {},
  doPushMessage: () => {},
  doBeginConversationWith: () => {},
  doOpenConversation: () => {},
});

const ConversationOnKey = {
  CONVERSATION_INIT_TRIGGER: "conversation-init-trigger", // trigger when a user message into a chat room and current user is not listen this chat room
} as const;

export default function ConversationContextProvider({
  children,
}: IConversationContextProviderProps) {
  const socketContext = useSocketContext();
  const conversationsRef = useRef<Record<string, IConversationCooked>>({});
  const userResolver = useUserResolver();

  useEffect(() => {
    const socket = socketContext.socket;
    if (socket == null) return;

    const conversationInitTriggerListener = (meta: IConversationExposed) => {
      const conversations = conversationsRef.current;
      const conversation = conversations[meta._id];
      if (conversation == null) {
        userResolver.getAll(meta.participants, (users) => {
          conversations[meta._id] = {
            ...meta,
            participants: users.map((user) => ({
              _id: user.id_,
              firstName: user.firstName,
              lastName: user.lastName,
              avartar: user.avartar,
            })),
          };
        });
      }
    };

    socket.on(
      ConversationOnKey.CONVERSATION_INIT_TRIGGER,
      conversationInitTriggerListener
    );

    return () => {
      socket.removeListener(
        ConversationOnKey.CONVERSATION_INIT_TRIGGER,
        conversationInitTriggerListener
      );
    };
  }, [socketContext.socket, userResolver]);

  const doPushMessage = (message: IConversationMessageExposed) => {
    const conversationId = message.conversation;
    const conversations = conversationsRef.current;
    const conversation = conversations[conversationId];
    if (conversation != null) {
      const participants = conversation.participants;
      const sender = participants.find((p) => p._id === message.sender);
      const messageCooked: IConversationMessageCooked = {
        ...message,
        sender: sender,
      };
      const messages = conversation.messages;
      if (messages == null) {
        conversation.messages = [];
      } else {
        messages.push(messageCooked);
      }
    } else {
      console.error(
        "Violation, a message was when no context message inited sent",
        message
      );
    }
  };

  const doBeginConversationWith = (user: string) => {
    console.log(user);
    // Call API to get or create a conversation with this user
    // Push this conversation to conversations meta
    // Open this conversation
  };

  const doOpenConversation = (conversation: string) => {
    console.log(conversation);
    // Open a conversation this conversations meta datas
    // if not a conversation found in conversations, do nothing
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations: conversationsRef.current,
        doPushMessage,
        doBeginConversationWith,
        doOpenConversation,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}
