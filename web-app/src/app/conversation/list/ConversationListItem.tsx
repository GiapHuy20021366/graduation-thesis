import {
  IConversationCooked,
  IConversationMessageCooked,
  IConversationParticipant,
} from "../../../data";
import { useAuthContext } from "../../../hooks";
import { Conversation, Avatar } from "@chatscope/chat-ui-kit-react";

interface IConversationListItemProps {
  active?: boolean;
  conversation: IConversationCooked;
}

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

const toLastestMessage = (
  messages?: IConversationMessageCooked[]
): IConversationMessageCooked | undefined => {
  if (messages == null) return;
  if (messages.length === 0) return;
  return messages[messages.length - 1];
};

export default function ConversationListItem({
  conversation,
  active,
}: IConversationListItemProps) {
  const authContext = useAuthContext();
  const op = toOpposite(conversation.participants, authContext.account?._id);

  const latestMessage = toLastestMessage(conversation.messages);

  return (
    <Conversation
      info={latestMessage?.textContent}
      lastSenderName={latestMessage?.sender?.firstName}
      name={op?.firstName}
      active={active}
      style={{
        borderRadius: "5px",
      }}
    >
      <Avatar name={op?.firstName} src={op?.avatar} size="xs" />
    </Conversation>
  );
}
