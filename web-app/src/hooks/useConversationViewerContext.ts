import { useContext } from "react";
import { ConversationViewerContext } from "../app/conversation/viewer/ConversationViewerContext";

export function useConversationViewerContext() {
  const context = useContext(ConversationViewerContext);
  if (context === undefined) {
    throw new Error(
      "useConversationViewerContext must be used within a ConversationViewerContextProvider"
    );
  }
  return context;
}
