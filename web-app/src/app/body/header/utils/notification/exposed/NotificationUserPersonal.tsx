import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";

type NotificationdUserPersonalProps = StackProps & {
  group: INotificationGroup;
};

const NotificationdUserPersonal = React.forwardRef<
  HTMLDivElement,
  NotificationdUserPersonalProps
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
        Cập nhật thông tin cá nhân ngay để chúng tôi có thể gợi ý những thực
        phẩm tốt nhất cho bạn
      </Typography>
    </Stack>
  );
});

export default NotificationdUserPersonal;
