import { useParams } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import {
  useConversationContext,
  useLoading,
  useQueryDevice,
} from "../../../hooks";
import { useEffect, useRef, useState } from "react";
import ConversationViewerContextProvider from "./ConversationViewerContext";
import ConversationViewerData from "./ConversationViewerChatProvider";
import { Box, Divider, Stack } from "@mui/material";
import MyConversationList from "../list/ConversationListAll";
import NoAccess from "../../common/NoAccess";

interface IConversationViewerIdProps {
  id?: string;
}

export default function ConversationViewerId({
  id,
}: IConversationViewerIdProps) {
  const conversationContext = useConversationContext();
  const params = useParams();
  const conversationId = id ?? params.id;
  const loading = useLoading();
  const [isError, setIsError] = useState<boolean>(false);

  const loadedId = useRef<string>();
  const device = useQueryDevice();
  const isMobile = device === "MOBILE";

  useEffect(() => {
    if (conversationId && loadedId.current !== conversationId) {
      loading.active();
      conversationContext.doLoadConversation(conversationId, (conversation) => {
        loading.deactive();
        if (conversation == null) {
          setIsError(true);
        }
      });
    }
  }, [conversationContext, conversationId, loading]);

  const isNotAccessable =
    conversationId != null &&
    conversationContext.conversations[conversationId] == null;

  return (
    <>
      <Stack
        sx={{
          width: "100%",
          boxSizing: "border-box",
          height: "100%",
        }}
        direction={"row"}
        gap={1}
      >
        {(!isMobile || conversationId == null) && (
          <MyConversationList sx={{ flex: 4, gap: 1 }} />
        )}
        <Divider orientation="vertical" sx={{ backgroundColor: "inherit" }} />
        <Box sx={{ flex: 8 }} height={"100%"}>
          {conversationId != null && (
            <>
              {isNotAccessable ? (
                <NoAccess />
              ) : (
                <>
                  {isError ? (
                    <PageNotFound />
                  ) : (
                    <ConversationViewerContextProvider
                      conversation={
                        conversationContext.conversations[conversationId]
                      }
                    >
                      <ConversationViewerData />
                    </ConversationViewerContextProvider>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Stack>
    </>
  );
}
