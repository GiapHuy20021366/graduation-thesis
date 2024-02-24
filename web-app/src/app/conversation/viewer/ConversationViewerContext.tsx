import React, { createContext, useEffect } from "react";
import {
  IConversationCooked,
  IConversationMessage,
  IConversationMessageCooked,
  IConversationMessageExposed,
} from "../../../data";
import { useSocketContext } from "../../../hooks";

interface IConversationViewerContextProviderProps {
  children: React.ReactNode;
  conversation: IConversationCooked;
}

interface IConversationViewerContext {
  messages: IConversationMessageCooked[];
  loadMessages: (from: number, to: number) => void;
  sendMessage: (message: IConversationMessage) => void;
}

export const ConversationViewerContext =
  createContext<IConversationViewerContext>({
    messages: [],
    loadMessages: () => {},
    sendMessage: () => {},
  });

const ConversationViewerEmitKey = {
  CONVERSATION_JOIN: "conversation-join",
  CONVERSATION_LEAVE: "conversation-leave",
  CONVERSATION_SEND_MESSAGE: "conversation-send-message",
} as const;

const toConversationRoom = (conversationId: string) => {
  return `Conversation@${conversationId}`;
};

export default function ConversationViewerContextProvider({
  children,
  conversation,
}: IConversationViewerContextProviderProps) {
  const socketContext = useSocketContext();
  const messages = conversation.messages ?? [];
  const conversationId = conversation._id;

  useEffect(() => {
    const socket = socketContext.socket;
    if (socket == null) return;
    const room = toConversationRoom(conversationId);

    const onConversationNewMessage = (
      message: IConversationMessageExposed
    ) => {
      console.log(message);
    };

    socket.on(
      `Conversation@${conversationId}-new-message`,
      onConversationNewMessage
    );

    // join room
    socket.emit(ConversationViewerEmitKey.CONVERSATION_JOIN, room);

    return () => {
      socket.removeListener(
        `Conversation@${conversationId}-new-message`,
        onConversationNewMessage
      );
      socket.emit(ConversationViewerEmitKey.CONVERSATION_LEAVE, room);
    };
  }, [conversationId, socketContext.socket]);

  const loadMessages = (from: number, to: number) => {
    console.log(from, to);
  };

  const sendMessage = (message: IConversationMessage) => {
    console.log(message);
  };

  return (
    <ConversationViewerContext.Provider
      value={{ messages, loadMessages, sendMessage }}
    >
      {children}
    </ConversationViewerContext.Provider>
  );
}
