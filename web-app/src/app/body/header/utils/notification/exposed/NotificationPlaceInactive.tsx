import React from "react";
import { Avatar, Box, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";
import { useComponentLanguage } from "../../../../../../hooks";

type NotificationPlaceInactiveProps = StackProps & {
  group: INotificationGroup;
};

const NotificationPlaceInactive = React.forwardRef<
  HTMLDivElement,
  NotificationPlaceInactiveProps
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
      gap={3}
      direction={"row"}
      p={1}
    >
      <Box width={"60px"}>
        <SquareContainer size={"60px"}>
          <Avatar sx={{ width: "100%", height: "100%" }} />
        </SquareContainer>
      </Box>
      <Typography>{lang("place-inactive")}</Typography>
    </Stack>
  );
});

export default NotificationPlaceInactive;
