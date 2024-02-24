interface IConversationViewerIdProps {
  id: string;
}

export default function ConversationViewerId({
  id,
}: IConversationViewerIdProps) {
  console.log(id);
  return <>{id}</>;
}
