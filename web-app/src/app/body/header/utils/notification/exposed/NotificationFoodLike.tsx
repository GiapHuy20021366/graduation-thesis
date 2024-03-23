import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";

type NotificationFoodLikeProps = StackProps & {
  group: INotificationGroup;
};

interface NotificationFoodLikeMerge extends INotificationGroup {
  users: string[];
}

const toExposed = (group: INotificationGroup): NotificationFoodLikeMerge => {
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

const NotificationFoodLike = React.forwardRef<
  HTMLDivElement,
  NotificationFoodLikeProps
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
        {data.users.length} người vừa thích một thực phẩm mà bạn chia sẻ
      </Typography>
    </Stack>
  );
});

export default NotificationFoodLike;
