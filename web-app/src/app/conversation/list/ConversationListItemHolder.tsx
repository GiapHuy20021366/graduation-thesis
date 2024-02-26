import React from "react";
import { Stack, StackProps } from "@mui/material";
import { IConversationMessageCooked } from "../../../data";

type ConversationListItemHolderProps = StackProps & {
  active?: boolean;
  lastMessage?: IConversationMessageCooked;
};

const ConversationListItemHolder = React.forwardRef<
  HTMLDivElement,
  ConversationListItemHolderProps
>((props, ref) => {
  const { active, lastMessage, ...rest } = props;
  console.log(lastMessage);
  return (
    <Stack
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
      display={active ? "flex" : "none"}
    >
      ConversationList Hoder
    </Stack>
  );
});

export default ConversationListItemHolder;
