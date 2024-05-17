import React from "react";
import { Avatar, Box, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";
import { useComponentLanguage } from "../../../../../../hooks";

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
  const lang = useComponentLanguage("NotificationExposed");
  const data = toExposed(group);
  return (
    <StyledLink
      to={applicationPages.FOOD_VIEW}
      key={group._id}
      state={{ foodIds: toFoods(data) }}
    >
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
        <Typography>
          {lang("food-suggested-category", data.foods.length)}
        </Typography>
      </Stack>
    </StyledLink>
  );
});

export default NotificationFoodAround;
