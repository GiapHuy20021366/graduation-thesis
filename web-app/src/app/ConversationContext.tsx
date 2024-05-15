import React, {
  createContext,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  IConversationCooked,
  IConversationExposed,
  IConversationMessageCooked,
  IConversationMessageExposed,
} from "../data";
import {
  useAuthContext,
  useComponentLanguage,
  useDirty,
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
  snaps: IConversationCookedWithLastMessage[];

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

  doLoadConversation: (
    conversation: string,
    fn?: (conversation: IConversationCooked | undefined) => void
  ) => void;

  doLoadConversations: () => void;
  updateSnaps: (msg: IConversationMessageCooked) => void;
}

export const ConversationContext = createContext<IConversationContext>({
  conversations: {},
  snaps: [],
  doPushMessage: () => {},
  doBeginConversationWith: () => {},
  doOpenConversation: () => {},
  doLoadConversation: () => {},
  doLoadConversations: () => {},
  updateSnaps: () => {},
});

const ConversationOnKey = {
  CONVERSATION_META: "conversation-meta",
  CONVERSATION_NEW_MESSAGE: "conversation-new-message",
} as const;

const newDefaultParticipant = () => ({
  _id: "0",
  firstName: "SYSTEM_",
  lastName: "USER",
});

export interface IConversationCookedWithLastMessage {
  meta: IConversationCooked;
  message?: IConversationMessageCooked;
}

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
  const lang = useComponentLanguage();

  // Store conversation + last message
  const [snaps, setSnaps] = useState<IConversationCookedWithLastMessage[]>([]);

  const updateSnaps = useCallback(
    (message: IConversationMessageCooked) => {
      const copied = snaps.slice();
      const snap = copied.find((c) => c.meta._id === message.conversation);
      if (snap != null) {
        snap.message = message;
        setSnaps(copied);
      }
    },
    [snaps]
  );

  const refreshRefMeta = useCallback(() => {
    const meta = JSON.parse(JSON.stringify(conversationsRef.current));
    conversationsRef.current = { ...meta };
  }, []);

  const doLoadConversations = useCallback(() => {
    if (auth == null) return;
    messageFetcher
      .getConversations({ skip: snaps.length, limit: 24 }, auth)
      .then((res) => {
        const conversations = res.data;
        if (conversations && conversations.length > 0) {
          const participants: string[] = [];
          conversations.forEach((conversation) => {
            conversation.participants.forEach((participant) => {
              if (!participants.includes(participant)) {
                participants.push(participant);
              }
            });
          });
          const currentConversations = conversationsRef.current;
          userResolver.getAll(participants, () => {
            const userDict = userResolver.getDict();
            conversations.forEach((conversation) => {
              if (currentConversations[conversation._id] != null) return;

              const users = conversation.participants;

              currentConversations[conversation._id] = {
                ...conversation,
                participants: users.map((user) => {
                  const cacheUser = userDict[user];
                  if (cacheUser) {
                    return {
                      _id: cacheUser._id,
                      firstName: cacheUser.firstName,
                      lastName: cacheUser.lastName,
                      avatar: cacheUser.avatar,
                    };
                  } else {
                    return newDefaultParticipant();
                  }
                }),
              };
            });
            refreshRefMeta();

            // Add snapshot
            const copied = snaps.slice();
            const cookeds = conversations.map(
              (c) => conversationsRef.current[c._id]
            );
            cookeds.forEach((cooked) => {
              const conversation = copied.find(
                (c) => c.meta._id === cooked._id
              );
              if (conversation == null) {
                copied.push({ meta: cooked });
              }
            });
            setSnaps(copied);
          });
        }
      });
  }, [auth, refreshRefMeta, snaps, userResolver]);

  const dirty = useDirty();
  useEffect(() => {
    if (auth != null) {
      dirty.perform(() => {
        doLoadConversations();
      });
    }
  }, [auth, dirty, doLoadConversations]);

  useEffect(() => {
    const socket = socketContext.socket;
    if (socket == null) return;

    const onConversationMeta = (meta: IConversationExposed) => {
      // When an user start message to another user
      // console.log("New meta on global context", meta);
      const conversations = conversationsRef.current;
      const conversation = conversations[meta._id];
      if (conversation == null) {
        userResolver.getAll(meta.participants, (users) => {
          const updated = {
            ...meta,
            participants: users.map((user) => ({
              _id: user._id,
              firstName: user.firstName,
              lastName: user.lastName,
              avatar: user.avatar,
            })),
          };
          conversations[meta._id] = updated;
          refreshRefMeta();
          // Add snapshot
          const copied = snaps.slice();
          const conversation = copied.find((c) => c.meta._id === meta._id);
          if (conversation == null) {
            copied.push({ meta: conversationsRef.current[meta._id] });
          }
          setSnaps(copied);
        });
      }
    };

    const onConversationNewMessage = (
      _uuid: string,
      message: IConversationMessageExposed
    ) => {
      // Expect conversation data already appear on context
      // console.log("New message on global context", _uuid, message);
      // Add snapshot
      doPushMessage(message);
      const copied = snaps.slice();
      const conversation = copied.find(
        (c) => c.meta._id === message.conversation
      );
      if (conversation != null) {
        const meta = conversationsRef.current[message.conversation];
        if (meta != null) {
          const sender = meta.participants.find(
            (p) => p._id === message.sender
          );
          if (sender != null) {
            conversation.message = {
              ...message,
              sender: sender,
            };
            setSnaps(copied);
          }
        }
      }
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
  }, [refreshRefMeta, snaps, socketContext.socket, userResolver]);

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
                  _id: user._id,
                  firstName: user.firstName,
                  lastName: user.lastName,
                  avatar: user.avatar,
                })),
              };
              refreshRefMeta();
              navigate(`/conversation/${conversation._id}/view`);
            });
          } else {
            navigate(`/conversation/${conversation._id}/view`);
          }
        }
      })
      .catch(() => {
        toastContext.error(lang("can-not-message-now"));
      });
  };

  const doOpenConversation = (conversation: string) => {
    navigate(`/conversation/${conversation}/view`);
  };

  const doLoadConversation = (
    conversation: string,
    fn?: (conversation: IConversationCooked | undefined) => void
  ) => {
    if (auth == null) {
      fn && fn(undefined);
      return;
    }
    const currentConversations = conversationsRef.current;
    const loadedConversation = currentConversations[conversation];
    if (loadedConversation != null) {
      fn && fn(loadedConversation);
    } else {
      messageFetcher.getConversation(conversation, auth).then((res) => {
        const resConversation = res.data;
        if (resConversation) {
          const users = resConversation.participants;
          userResolver.getAll(resConversation.participants, () => {
            const userDict = userResolver.getDict();
            currentConversations[conversation] = {
              ...resConversation,
              participants: users.map((userId) => {
                const user = userDict[userId];
                if (user) {
                  return {
                    _id: user._id,
                    firstName: user.firstName,
                    lastName: user.lastName,
                    avatar: user.avatar,
                  };
                } else return newDefaultParticipant();
              }),
            };
            refreshRefMeta();
          });
        } else {
          fn && fn(undefined);
        }
      });
    }
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations: conversationsRef.current,
        doPushMessage,
        doBeginConversationWith,
        doOpenConversation,
        doLoadConversation,
        snaps,
        doLoadConversations,
        updateSnaps,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}
