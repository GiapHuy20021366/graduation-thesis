import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";

type NotificationFoodAroundProps = StackProps & {
  group: INotificationGroup;
};

interface NotificationFoodAroundMerge extends INotificationGroup {
  foods: string[];
}

const toExposed = (group: INotificationGroup): NotificationFoodAroundMerge => {
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

const NotificationFoodAround = React.forwardRef<
  HTMLDivElement,
  NotificationFoodAroundProps
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
        Tìm thấy {data.foods.length} thực phẩm phù hợp với sở thích của bạn
      </Typography>
    </Stack>
  );
});

export default NotificationFoodAround;
