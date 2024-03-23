import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";

type NotificationPlaceInactiveProps = StackProps & {
  group: INotificationGroup;
};

const NotificationPlaceInactive = React.forwardRef<
  HTMLDivElement,
  NotificationPlaceInactiveProps
>((props, ref) => {
  const { group, ...rest } = props;
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
      <Typography>
        Một địa điểm của bạn đã bị khóa do vi phạm các chính sách về cộng đồng
      </Typography>
    </Stack>
  );
});

export default NotificationPlaceInactive;
