import { Stack } from "@mui/material";
import { useConversationContext } from "../../../hooks";
import ConversationListItem from "./ConversationListItem";
import { useNavigate, useParams } from "react-router-dom";
import ConversationViewerId from "../viewer/ConversationViewerId";
import { useEffect } from "react";

export default function ConversationList() {
  const conversationContext = useConversationContext();
  const params = useParams();
  console.log("Dict", conversationContext, conversationContext.conversations);
  const activeId =
    params.id ?? new URLSearchParams(window.location.search).get("ref");

  const activeConversation =
    activeId != null ? conversationContext.conversations[activeId] : undefined;

  useEffect(() => {
    console.log(conversationContext.conversations);
  }, [conversationContext.conversations]);

  const navigate = useNavigate();

  return (
    <Stack
      direction={"row"}
      width={"100%"}
      boxSizing={"border-box"}
      height={"100%"}
    >
      <Stack
        height={"100%"}
        flex={4}
        boxShadow={1}
        sx={{
          overflowY: "auto",
        }}
        boxSizing={"border-box"}
      >
        {Object.entries(conversationContext.conversations).map(
          ([conversationId, conversation]) => {
            return (
              <ConversationListItem
                active={activeId === conversationId}
                conversation={conversation}
                key={conversationId}
                onClick={() =>
                  navigate("/conversation?ref=" + conversationId, {
                    replace: true,
                  })
                }
              />
            );
          }
        )}
      </Stack>
      <Stack
        height={"100%"}
        flex={6}
        display={["none", "flex", "flex", "flex"]}
        boxShadow={1}
        sx={{
          overflowY: "auto",
        }}
        boxSizing={"border-box"}
      >
        {activeConversation && (
          <ConversationViewerId id={activeConversation._id} />
        )}
      </Stack>
    </Stack>
  );
}
