import { useAuthContext, useConversationViewerContext } from "../../../hooks";
import { useEffect, useState } from "react";
import {
  ConversationMessageType,
  IConversationMessageCooked,
  IConversationParticipant,
} from "../../../data";
import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  InfoButton,
  Message,
  MessageGroup,
  MessageInput,
  MessageList,
} from "@chatscope/chat-ui-kit-react";

interface IConversationMessageGroupMessage {
  sendTime: string;
  text?: string;
  _id: string;
}

interface IConversationMessageGroup {
  _id: string; // id of last message;
  sendTime: string; // time of first message;
  messages: IConversationMessageGroupMessage[];
  sender: IConversationParticipant;
}

type DateCooked = Omit<IConversationMessageCooked, "updatedAt"> & {
  updatedAt: Date;
};

const toConversationMessageGroups = (
  messages: IConversationMessageCooked[]
): IConversationMessageGroup[] => {
  const sorted = messages.sort((a, b) => {
    a.updatedAt = new Date(a.updatedAt);
    b.updatedAt = new Date(b.updatedAt);
    return a.updatedAt.getTime() - b.updatedAt.getTime();
  }) as unknown as DateCooked[];

  const groups: DateCooked[][] = [];
  let cooking: DateCooked[] = [];
  for (let i = 0; i < sorted.length; ++i) {
    const msg = sorted[i];
    if (cooking.length === 0) {
      cooking.push(msg);
      if (i === sorted.length - 1) {
        groups.push(cooking);
      }
      continue;
    }
    const cooker = cooking[0].sender?._id;
    const lmsg = cooking[cooking.length - 1];
    if (
      cooker !== msg.sender?._id ||
      lmsg.updatedAt.getTime() + 60000 < msg.updatedAt.getTime()
    ) {
      groups.push(cooking);
      cooking = [];
      cooking.push(msg);
      if (i === sorted.length - 1) {
        groups.push(cooking);
      }
    } else {
      cooking.push(msg);
      if (i === sorted.length - 1) {
        groups.push(cooking);
      }
    }
  }

  return groups.map(
    (g): IConversationMessageGroup => ({
      _id: g[g.length - 1]._id,
      messages: g.map((i) => ({
        sendTime: new Date(i.updatedAt).toISOString(),
        text: i.textContent,
        _id: i._id,
      })),
      sender: g[0].sender!,
      sendTime: new Date(g[0].updatedAt).toISOString(),
    })
  );
};

const toOpposite = (
  participants: IConversationParticipant[],
  currentUser?: string
): IConversationParticipant | null => {
  if (participants.length === 0) return null;
  else {
    if (participants[0]._id === currentUser) return participants[1];
    else return participants[0];
  }
};

export default function ConversationViewerData() {
  const viewerContext = useConversationViewerContext();
  const { messages, sendMessage, conversation } = viewerContext;
  const authContext = useAuthContext();
  const { account } = authContext;

  const [cookeds, setCookeds] = useState<IConversationMessageGroup[]>([]);
  useEffect(() => {
    setCookeds(toConversationMessageGroups(messages));
  }, [messages]);

  const [text, setText] = useState<string>("");

  const handleSendMessage = () => {
    if (account == null) return;
    sendMessage({
      conversation: conversation._id,
      sender: account._id,
      type: ConversationMessageType.TEXT,
      textContent: text,
    });
    setText("");
  };

  const op = toOpposite(conversation.participants, authContext.account?._id);

  return (
    <ChatContainer
      style={{ height: "100̀̀̀%", width: "100%", boxSizing: "border-box" }}
    >
      <ConversationHeader>
        <Avatar name={op?.firstName} src={op?.avatar} />
        <ConversationHeader.Content
          info="Người dùng hệ thống"
          userName={op?.firstName}
        />
        <ConversationHeader.Actions>
          <InfoButton />
        </ConversationHeader.Actions>
      </ConversationHeader>
      <MessageList>
        {cookeds.map((group) => {
          const direction =
            group.sender._id === account?._id ? "outgoing" : "incoming";
          return (
            <MessageGroup
              direction={direction}
              sender={group.sender.firstName}
              sentTime={group.sendTime}
              key={group._id}
              style={{
                marginTop: "30px",
              }}
            >
              <Avatar src={group.sender.avatar} name={group.sender.firstName} />
              <MessageGroup.Messages>
                <Message.Header sentTime={group.sendTime} />
                {group.messages.map((msg) => {
                  return (
                    <Message
                      key={`msg-${msg._id}`}
                      model={{
                        message: msg.text,
                        direction: direction,
                        position: "last",
                      }}
                    />
                  );
                })}
              </MessageGroup.Messages>
            </MessageGroup>
          );
        })}
      </MessageList>
      <MessageInput
        autoFocus
        placeholder="Type message here"
        attachButton={false}
        value={text}
        onChange={(_, text) => setText(text)}
        sendDisabled={false}
        onSend={() => handleSendMessage()}
      />
    </ChatContainer>
  );
}
