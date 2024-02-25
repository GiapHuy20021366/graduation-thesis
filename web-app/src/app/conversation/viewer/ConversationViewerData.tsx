interface IConversationViewerDataProps {
  id: string;
}

export default function ConversationViewerData({
  id,
}: IConversationViewerDataProps) {
  console.log(id);
  return <>{id}</>;
}
