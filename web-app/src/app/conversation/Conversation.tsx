import { Routes, Route } from "react-router-dom";
import ConversationList from "./list/ConversationList";
import ConversationViewerId from "./viewer/ConversationViewerId";

export default function Conversation() {
  return (
    <Routes>
      <Route path="/" element={<ConversationList />} />
      <Route path="/:id" element={<ConversationViewerId />} />
    </Routes>
  );
}
