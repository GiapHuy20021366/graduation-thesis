import React from "react";
import { Avatar, Box, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";
import { useComponentLanguage } from "../../../../../../hooks";

type NotificationPlaceRatingProps = StackProps & {
  group: INotificationGroup;
};

interface NotificationPlaceRatingMerge extends INotificationGroup {
  users: string[];
}

const toExposed = (group: INotificationGroup): NotificationPlaceRatingMerge => {
  const users: string[] = [];
  group.datas.forEach((d) => {
    const typedUser = d.typedUser;
    if (typedUser) {
      users.push(typedUser);
    }
  });
  return {
    ...group,
    users,
  };
};

const NotificationPlaceRating = React.forwardRef<
  HTMLDivElement,
  NotificationPlaceRatingProps
>((props, ref) => {
  const { group, ...rest } = props;
  const lang = useComponentLanguage("NotificationExposed");
  const data = toExposed(group);
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
      <Typography>{lang("place-rating", data.users.length)}</Typography>
    </Stack>
  );
});

export default NotificationPlaceRating;
