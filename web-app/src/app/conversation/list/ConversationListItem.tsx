import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import {
  IConversationCooked,
  IConversationMessageCooked,
  IConversationParticipant,
} from "../../../data";
import { useAuthContext } from "../../../hooks";

type ConversationListItemProps = StackProps & {
  active?: boolean;
  conversation: IConversationCooked;
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

const toLastestMessage = (
  messages?: IConversationMessageCooked[]
): IConversationMessageCooked | undefined => {
  if (messages == null) return;
  if (messages.length === 0) return;
  return messages[messages.length - 1];
};

const ConversationListItem = React.forwardRef<
  HTMLDivElement,
  ConversationListItemProps
>((props, ref) => {
  const { active, conversation, ...rest } = props;
  const authContext = useAuthContext();
  const op = toOpposite(conversation.participants, authContext.account?.id_);

  const latestMessage = toLastestMessage(conversation.messages);

  return (
    <Stack
      ref={ref}
      direction={"row"}
      gap={2}
      py={1}
      px={1}
      boxShadow={1}
      {...rest}
      sx={{
        width: "100%",
        cursor: "pointer",
        boxSizing: "border-box",
        ...(props.sx ?? {}),
      }}
    >
      <Avatar
        sx={{
          width: [45, 60, 75, 90],
          height: [45, 60, 75, 90],
          cursor: "pointer",
          boxShadow: 5,
        }}
        src={op?.avartar}
      >
        {op?.firstName[0] ?? "H"}
      </Avatar>
      <Stack flex={1}>
        <Typography sx={{ fontWeight: 500 }}>
          {op?.firstName} {op?.lastName}
        </Typography>
        <Typography>
          {latestMessage && (
            <>
              {latestMessage.sender?.firstName} {latestMessage.sender?.lastName}
              : {latestMessage.textContent}
            </>
          )}
        </Typography>
      </Stack>
    </Stack>
  );
});

export default ConversationListItem;
