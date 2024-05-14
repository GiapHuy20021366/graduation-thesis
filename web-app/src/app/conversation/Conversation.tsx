import { Routes, Route } from "react-router-dom";
import ConversationViewerId from "./viewer/ConversationViewerId";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";

export default function Conversation() {
  return (
    <Routes>
      <Route path="/" element={<ConversationViewerId />} />
      <Route path="/:id" element={<ConversationViewerId />} />
    </Routes>
  );
}
