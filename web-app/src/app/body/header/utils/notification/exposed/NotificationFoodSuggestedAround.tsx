import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";
import { useComponentLanguage } from "../../../../../../hooks";

type NotificationFoodSuggestedAroundProps = StackProps & {
  group: INotificationGroup;
};

interface NotificationFoodSuggestedAroundMerge extends INotificationGroup {
  foods: string[];
}

const toExposed = (
  group: INotificationGroup
): NotificationFoodSuggestedAroundMerge => {
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

const NotificationFoodSuggestedAround = React.forwardRef<
  HTMLDivElement,
  NotificationFoodSuggestedAroundProps
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
      gap={1}
      direction={"row"}
      p={1}
    >
      <SquareContainer size={"12%"}>
        <Avatar sx={{ width: "100%", height: "100%" }} />
      </SquareContainer>
      <Typography>
        {lang("food-suggested-around", data.foods.length)}
      </Typography>
    </Stack>
  );
});

export default NotificationFoodSuggestedAround;
