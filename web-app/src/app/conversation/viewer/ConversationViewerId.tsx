import { useParams } from "react-router-dom";
import PageNotFound from "../../common/PageNotFound";

interface IConversationViewerIdProps {
  id?: string;
}

export default function ConversationViewerId({
  id,
}: IConversationViewerIdProps) {
  const params = useParams();
  const conversationId = id ?? params.id;
  if (conversationId == null) {
    return <PageNotFound />;
  }

  return <>{conversationId}</>;
}
