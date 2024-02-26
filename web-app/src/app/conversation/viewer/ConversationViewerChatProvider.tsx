import { Button, Stack, TextField, Typography } from "@mui/material";
import { useAuthContext, useConversationViewerContext } from "../../../hooks";
import { useState } from "react";
import { ConversationMessageType } from "../../../data";

export default function ConversationViewerData() {
  const viewerContext = useConversationViewerContext();
  const { messages, sendMessage, conversation } = viewerContext;
  const auth = useAuthContext();
  const { account } = auth;

  const [text, setText] = useState<string>("");

  const handleSendMessage = () => {
    if (account == null) return;
    sendMessage({
      conversation: conversation._id,
      sender: account.id_,
      type: ConversationMessageType.TEXT,
      textContent: text,
    });
  };

  return (
    <Stack height={"100%"} width={"100%"} boxSizing={"border-box"}>
      <Stack>Header</Stack>
      <Stack flex={1} sx={{ overflowY: "auto" }}>
        {messages.map((message) => (
          <Typography key={message._id}>{message.textContent}</Typography>
        ))}
      </Stack>
      <Stack>
        <TextField
          type="text"
          value={text}
          label={"Nhập tin nhắn"}
          onChange={(event) => setText(event.target.value)}
        />
        <Button onClick={handleSendMessage}>Send</Button>
      </Stack>
    </Stack>
  );
}
