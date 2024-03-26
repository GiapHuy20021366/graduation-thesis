import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";
import { useComponentLanguage } from "../../../../../../hooks";

type NotificationdUserWelcomeProps = StackProps & {
  group: INotificationGroup;
};

const NotificationdUserWelcome = React.forwardRef<
  HTMLDivElement,
  NotificationdUserWelcomeProps
>((props, ref) => {
  const { group, ...rest } = props;
  const lang = useComponentLanguage("NotificationExposed");
  return (
    <Stack
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(rest.sx ?? {}),
      }}
      gap={1}
      direction={"row"}
      p={1}
    >
      <SquareContainer size={"12%"}>
        <Avatar sx={{ width: "100%", height: "100%" }} />
      </SquareContainer>
      <Typography>{lang("user-welcome")}</Typography>
    </Stack>
  );
});

export default NotificationdUserWelcome;
