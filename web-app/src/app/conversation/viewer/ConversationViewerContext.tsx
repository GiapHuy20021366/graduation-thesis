import React, { createContext, useEffect, useState } from "react";
import {
  IConversationCooked,
  IConversationExposed,
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

const ConversationViewerOnKey = {
  CONVERSATION_META: "conversation-meta", // when this client was added to an conversation
  CONVERSATION_NEW_MESSAGE: (conversationId: string) =>
    `Conversation@${conversationId}-new-message`, // when a message send,
  CONVERSATION_MESSAGE_ERROR: (conversationId: string) =>
    `Conversation@${conversationId}-message-error`, // when a message sent is error
} as const;

const toConversationRoom = (conversationId: string) => {
  return `Conversation@${conversationId}`;
};

const toMessageUuid = (conversationId: string) => {
  return toConversationRoom(conversationId) + "@" + String(Date.now());
};

export default function ConversationViewerContextProvider({
  children,
  conversation,
}: IConversationViewerContextProviderProps) {
  const socketContext = useSocketContext();
  const conversationId = conversation._id;
  const [messages, setMessages] = useState<IConversationMessageCooked[]>(
    conversation.messages ?? []
  );
  const [sendings, setSendings] = useState<IConversationMessage[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    const socket = socketContext.socket;
    if (socket == null) return;

    const onConversationMeta = (conversation: IConversationExposed) => {
      console.log(conversation);
    };

    const onConversationNewMessage = (
      uuid: string,
      message: IConversationMessageExposed
    ) => {
      console.log(uuid, message);
    };

    const onConversationMessageError = (uuid: string) => {
      console.log(uuid);
      const _errors = errors.slice();
      _errors.push(uuid);
      setErrors(_errors);
    };

    socket.on(
      ConversationViewerOnKey.CONVERSATION_NEW_MESSAGE(conversationId),
      onConversationNewMessage
    );

    socket.on(ConversationViewerOnKey.CONVERSATION_META, onConversationMeta);

    socket.on(
      ConversationViewerOnKey.CONVERSATION_MESSAGE_ERROR(conversationId),
      onConversationMessageError
    );

    // join room
    socket.emit(ConversationViewerEmitKey.CONVERSATION_JOIN, conversationId);

    return () => {
      socket.emit(ConversationViewerEmitKey.CONVERSATION_LEAVE, conversationId);

      socket.removeListener(
        ConversationViewerOnKey.CONVERSATION_NEW_MESSAGE(conversationId),
        onConversationNewMessage
      );

      socket.removeListener(
        ConversationViewerOnKey.CONVERSATION_META,
        onConversationMeta
      );

      socket.removeListener(
        ConversationViewerOnKey.CONVERSATION_MESSAGE_ERROR(conversationId),
        onConversationMessageError
      );
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socketContext.socket]);

  const loadMessages = (from: number, to: number) => {
    console.log(from, to);
  };

  const sendMessage = (message: IConversationMessage) => {
    const socket = socketContext.socket;
    if (socket) {
      socket.emit(
        ConversationViewerEmitKey.CONVERSATION_SEND_MESSAGE,
        conversationId,
        toMessageUuid(conversationId),
        message
      );
    }
  };

  return (
    <ConversationViewerContext.Provider
      value={{ messages, loadMessages, sendMessage }}
    >
      {children}
    </ConversationViewerContext.Provider>
  );
}
