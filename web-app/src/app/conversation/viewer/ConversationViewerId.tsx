import { useParams } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";
import { useConversationContext, useLoading } from "../../../hooks";
import { useEffect, useRef, useState } from "react";
import ConversationViewerContextProvider from "./ConversationViewerContext";
import ConversationViewerData from "./ConversationViewerChatProvider";

interface IConversationViewerIdProps {
  id?: string;
}

export default function ConversationViewerId({
  id,
}: IConversationViewerIdProps) {
  const conversationContext = useConversationContext();
  const dirtyRef = useRef<boolean>(true);
  const params = useParams();
  const conversationId = id ?? params.id;
  const loading = useLoading();
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const isDirty = dirtyRef.current;
    if (isDirty) {
      dirtyRef.current = false;
      if (conversationId != null) {
        loading.active();
        conversationContext.doLoadConversation(
          conversationId,
          (conversation) => {
            loading.deactive();
            if (conversation == null) {
              setIsError(true);
            }
          }
        );
      }
    }
  }, [conversationContext, conversationId, loading]);

  if (conversationId == null || isError) {
    return <PageNotFound />;
  }

  return (
    <ConversationViewerContextProvider
      conversation={conversationContext.conversations[conversationId]}
    >
      <ConversationViewerData />
    </ConversationViewerContextProvider>
  );
}
