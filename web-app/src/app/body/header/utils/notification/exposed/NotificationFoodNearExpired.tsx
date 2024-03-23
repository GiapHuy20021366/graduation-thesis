import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";

type NotificationFoodNearExpiredProps = StackProps & {
  group: INotificationGroup;
};

interface NotificationFoodNearExpiredMerge extends INotificationGroup {
  foods: string[];
}

const toExposed = (group: INotificationGroup): NotificationFoodNearExpiredMerge => {
  const foods: string[] = [];
  group.datas.forEach((d) => {
    const typedFoods = d.typedFoods;
    if (typedFoods) {
      foods.push(...typedFoods);
    }
  });
  return {
    ...group,
    foods,
  };
};

const NotificationFoodNearExpired = React.forwardRef<
  HTMLDivElement,
  NotificationFoodNearExpiredProps
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
        Bạn có {data.foods.length} thực phẩm sắp hết hạn trong ngày hôm nay
      </Typography>
    </Stack>
  );
});

export default NotificationFoodNearExpired;
