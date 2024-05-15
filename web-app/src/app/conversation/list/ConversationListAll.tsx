import { Stack, StackProps } from "@mui/material";
import { useConversationContext } from "../../../hooks";
import ConversationListItem from "./ConversationListItem";
import { useParams } from "react-router-dom";
import StyledLink from "../../common/navigate/StyledLink";
import React from "react";
import { ConversationList } from "@chatscope/chat-ui-kit-react";

type ConversationListAllProps = StackProps;

const ConversationListAll = React.forwardRef<
  HTMLDivElement,
  ConversationListAllProps
>((props, ref) => {
  const conversationContext = useConversationContext();
  const params = useParams();

  const activeId = params.id;

  return (
    <Stack
      ref={ref}
      {...props}
      sx={{
        ".cs-conversation__name": {
          color: "text.primary",
        },
        ".cs-conversation": {
          backgroundColor: "background.default",
          color: "white",
          ":hover": {
            backgroundColor: "action.hover",
          },
        },
        ".cs-conversation.cs-conversation--active": {
          backgroundColor: "action.selected",
          color: "text.primary",
        },
        ".cs-conversation__info-content": {
          color: "text.primary",
        },
        ".cs-conversation__info": {
          color: "text.primary",
        },
        ".cs-avatar.cs-avatar--xs": {
          minWidth: "42.1px",
        },
        ...props.sx,
      }}
    >
      <ConversationList
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        {conversationContext.snaps.map(({ meta, message }) => {
          const conversationId = meta._id;
          return (
            <StyledLink
              to={`/conversation/${conversationId}/view`}
              key={conversationId}
            >
              <ConversationListItem
                active={activeId === conversationId}
                conversation={meta}
                lstMessage={message}
              />
            </StyledLink>
          );
        })}
      </ConversationList>
    </Stack>
  );
});

export default ConversationListAll;
