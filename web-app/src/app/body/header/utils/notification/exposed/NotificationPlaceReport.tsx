import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";

type NotificationPlaceReportProps = StackProps & {
  group: INotificationGroup;
};

interface NotificationPlaceReportMerge extends INotificationGroup {
  users: string[];
}

const toExposed = (group: INotificationGroup): NotificationPlaceReportMerge => {
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

const NotificationPlaceReport = React.forwardRef<
  HTMLDivElement,
  NotificationPlaceReportProps
>((props, ref) => {
  const { group, ...rest } = props;
  const data = toExposed(group);
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
        {data.users.length} người vừa báo cáo một địa điểm của bạn
      </Typography>
    </Stack>
  );
});

export default NotificationPlaceReport;
