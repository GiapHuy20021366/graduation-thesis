import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";
import { useComponentLanguage } from "../../../../../../hooks";

type NotificationFoodSubcribedPlaceProps = StackProps & {
  group: INotificationGroup;
};

interface NotificationSubcribedPlaceMerge extends INotificationGroup {
  foods: string[];
}

const toExposed = (
  group: INotificationGroup
): NotificationSubcribedPlaceMerge => {
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

const NotificationFoodSubcribedPlace = React.forwardRef<
  HTMLDivElement,
  NotificationFoodSubcribedPlaceProps
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
        {lang("food-subcribed-place", data.foods.length)}
      </Typography>
    </Stack>
  );
});

export default NotificationFoodSubcribedPlace;
