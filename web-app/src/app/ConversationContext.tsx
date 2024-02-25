import React, { createContext, useEffect, useRef } from "react";
import {
  IConversationCooked,
  IConversationExposed,
  IConversationMessageCooked,
  IConversationMessageExposed,
} from "../data";
import {
  useAuthContext,
  useSocketContext,
  useToastContext,
  useUserResolver,
} from "../hooks";
import { messageFetcher } from "../api";
import { useNavigate } from "react-router";

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
  CONVERSATION_META: "conversation-meta",
  CONVERSATION_NEW_MESSAGE: "conversation-new-message",
} as const;

export default function ConversationContextProvider({
  children,
}: IConversationContextProviderProps) {
  const socketContext = useSocketContext();
  const conversationsRef = useRef<Record<string, IConversationCooked>>({});
  const userResolver = useUserResolver();
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const toastContext = useToastContext();
  const navigate = useNavigate();

  useEffect(() => {
    const socket = socketContext.socket;
    if (socket == null) return;

    const onConversationMeta = (meta: IConversationExposed) => {
      console.log("New meta on global context", meta);
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

    const onConversationNewMessage = (
      _uuid: string,
      message: IConversationMessageExposed
    ) => {
      console.log("New message on global context", _uuid, message);
    };

    socket.on(ConversationOnKey.CONVERSATION_META, onConversationMeta);

    socket.on(
      ConversationOnKey.CONVERSATION_NEW_MESSAGE,
      onConversationNewMessage
    );

    return () => {
      socket.removeListener(
        ConversationOnKey.CONVERSATION_META,
        onConversationMeta
      );
      socket.removeListener(
        ConversationOnKey.CONVERSATION_NEW_MESSAGE,
        onConversationNewMessage
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
    if (auth == null) {
      return;
    }
    messageFetcher
      .createConversation(user, auth)
      .then((res) => {
        const conversation = res.data;
        if (conversation != null) {
          const conversations = conversationsRef.current;
          if (conversations[conversation._id] == null) {
            userResolver.getAll(conversation.participants, (users) => {
              conversations[conversation._id] = {
                ...conversation,
                participants: users.map((user) => ({
                  _id: user.id_,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  avartar: user.avartar,
                })),
              };
              navigate("/conversation/" + conversation._id);
            });
          } else {
            navigate("/conversation/" + conversation._id);
          }
        }
      })
      .catch(() => {
        toastContext.error("Không thể nhắn tin vào lúc này");
      });
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
