interface IConversationViewerDataProps {
  id: string;
}

export default function ConversationViewerId({
  id,
}: IConversationViewerDataProps) {
  console.log(id);
  return <>{id}</>;
}
