
import { useContext } from "react";
import { ConversationContext } from "../app/ConversationContext";

export function useConversationContext() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error(
      "useConversationContext must be used within a ConversationContextProvider"
    );
  }
  return context;
}
