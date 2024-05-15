import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IConversationCooked,
  IConversationMessage,
  IConversationMessageCooked,
  IConversationMessageExposed,
} from "../../../data";
import {
  useAuthContext,
  useConversationContext,
  useSocketContext,
  useUserResolver,
} from "../../../hooks";
import { messageFetcher } from "../../../api";

interface IConversationViewerContextProviderProps {
  children?: React.ReactNode;
  conversation: IConversationCooked;
}

interface IConversationViewerContext {
  messages: IConversationMessageCooked[];
  loadMessages: (to?: number | null) => void;
  sendMessage: (message: IConversationMessage) => void;
  conversation: IConversationCooked;
}

export const ConversationViewerContext =
  createContext<IConversationViewerContext>({
    messages: [],
    loadMessages: () => {},
    sendMessage: () => {},
    conversation: {} as IConversationCooked,
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
  const chatGlobalContext = useConversationContext();
  const { doPushMessage, updateSnaps } = chatGlobalContext;
  const conversationId = conversation._id;
  const [messages, setMessages] = useState<IConversationMessageCooked[]>(
    conversation.messages ?? []
  );
  const [sendings, setSendings] = useState<IConversationMessageExposed[]>([]);
  const [errors, setErrors] = useState<string[]>([]);

  const userResolver = useUserResolver();
  const authContext = useAuthContext();
  const { account, auth } = authContext;
  const currentConversationRef = useRef<string>();

  const loadMessages = useCallback(
    (to?: number | null, refresh?: boolean) => {
      if (auth == null) {
        return;
      }
      const first = messages[0];
      to ??=
        refresh || first == null
          ? Date.now()
          : new Date(first.createdAt).getTime();

      const targets = refresh ? [] : messages.slice();

      messageFetcher
        .getConversationMessages(conversation._id, null, to, null, auth)
        .then((res) => {
          const datas = res.data;
          if (datas != null) {
            const participants = conversation.participants;
            const cookeds: IConversationMessageCooked[] = datas.map((msg) => {
              const sender = participants.find((p) => p._id === msg.sender);
              return {
                ...msg,
                sender,
              };
            });
            const all = targets.slice();
            cookeds.forEach((cooked) => {
              if (all.findIndex((a) => a._id === cooked._id) === -1) {
                all.unshift(cooked);
              }
            });
            setMessages(all);
            if (all.length > 0) {
              const lst = all[all.length - 1];
              updateSnaps(lst);
            }
          }
        });
    },
    [auth, conversation._id, conversation.participants, messages, updateSnaps]
  );

  useEffect(() => {
    const current = currentConversationRef.current;
    if (current !== conversation._id) {
      currentConversationRef.current = conversation._id;
      // const messages = conversation.messages;
      setMessages([]);
      setSendings([]);
      setErrors([]);
      // let lstTime: number | null = null;
      // if (messages != null) {
      //   const first = messages[0];
      //   if (first != null) {
      //     lstTime = new Date(first.createdAt).getTime();
      //   }
      // }
      loadMessages(null, true);
    }
  }, [conversation, loadMessages]);

  useEffect(() => {
    const socket = socketContext.socket;
    if (socket == null) return;

    // const onConversationMeta = (conversation: IConversationExposed) => {
    //   console.log(conversation);
    // };

    const onConversationNewMessage = (
      uuid: string,
      message: IConversationMessageExposed
    ) => {
      const userDict = userResolver.getDict();
      const _sendings = sendings.slice();
      const index = _sendings.findIndex((msg) => msg._id === uuid);
      if (index !== -1) {
        _sendings.splice(index, 1);
        setSendings(_sendings);
      }
      const senderInfo = userDict[message.sender];
      const _messages = messages.slice();
      const msgIndex = _messages.findIndex((msg) => msg._id === message._id);
      if (msgIndex === -1) {
        // console.log(uuid, message);
        _messages.push({
          ...message,
          sender: senderInfo && {
            _id: senderInfo._id,
            firstName: senderInfo.firstName,
            lastName: senderInfo.lastName,
            avatar: senderInfo.avatar,
          },
        });
        setMessages(_messages);
        updateSnaps(_messages[_messages.length - 1]);
        // doPushMessage(message);
      }
    };

    const onConversationMessageError = (uuid: string) => {
      // console.log(uuid);
      const _errors = errors.slice();
      _errors.push(uuid);
      setErrors(_errors);
    };

    socket.on(
      ConversationViewerOnKey.CONVERSATION_NEW_MESSAGE(conversationId),
      onConversationNewMessage
    );

    // socket.on(ConversationViewerOnKey.CONVERSATION_META, onConversationMeta);

    socket.on(
      ConversationViewerOnKey.CONVERSATION_MESSAGE_ERROR(conversationId),
      onConversationMessageError
    );

    return () => {
      socket.removeListener(
        ConversationViewerOnKey.CONVERSATION_NEW_MESSAGE(conversationId),
        onConversationNewMessage
      );

      // socket.removeListener(
      //   ConversationViewerOnKey.CONVERSATION_META,
      //   onConversationMeta
      // );

      socket.removeListener(
        ConversationViewerOnKey.CONVERSATION_MESSAGE_ERROR(conversationId),
        onConversationMessageError
      );
    };
  }, [
    conversationId,
    doPushMessage,
    errors,
    messages,
    sendings,
    socketContext.socket,
    updateSnaps,
    userResolver,
  ]);

  const sendMessage = (message: IConversationMessage) => {
    const socket = socketContext.socket;
    if (socket && account) {
      const uuid = toMessageUuid(conversationId);
      setSendings([
        ...sendings,
        {
          ...message,
          _id: uuid,
          createdAt: new Date(),
          updatedAt: new Date(),
          sender: account._id,
        },
      ]);
      socket.emit(
        ConversationViewerEmitKey.CONVERSATION_SEND_MESSAGE,
        conversationId,
        uuid,
        message
      );
    }
  };

  useEffect(() => {
    // join room
    const socket = socketContext.socket;
    if (socket == null) return;
    socket.emit(ConversationViewerEmitKey.CONVERSATION_JOIN, conversationId);
    return () => {
      socket.emit(ConversationViewerEmitKey.CONVERSATION_LEAVE, conversationId);
    };
  }, [conversationId, socketContext.socket]);

  return (
    <ConversationViewerContext.Provider
      value={{ messages, loadMessages, sendMessage, conversation }}
    >
      {children}
    </ConversationViewerContext.Provider>
  );
}
