import { Stack, StackProps } from "@mui/material";
import { useConversationContext } from "../../../hooks";
import ConversationListItem from "./ConversationListItem";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
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

  useEffect(() => {
    console.log(conversationContext.conversations);
  }, [conversationContext.conversations]);

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
        ...props.sx,
      }}
    >
      <ConversationList
        style={{
          height: "100%",
          width: "100%",
        }}
      >
        {Object.entries(conversationContext.conversations).map(
          ([conversationId, conversation]) => {
            return (
              <StyledLink
                to={`/conversation/${conversationId}`}
                key={conversationId}
              >
                <ConversationListItem
                  active={activeId === conversationId}
                  conversation={conversation}
                />
              </StyledLink>
            );
          }
        )}
      </ConversationList>
    </Stack>
  );
});

export default ConversationListAll;
