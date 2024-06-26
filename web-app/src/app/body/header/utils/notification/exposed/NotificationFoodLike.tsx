import React from "react";
import { Avatar, Box, Stack, StackProps, Typography } from "@mui/material";
import { INotificationGroup, toFoods } from "../../../../../../data";
import SquareContainer from "../../../../../common/custom/SquareContainer";
import {
  applicationPages,
  useAuthContext,
  useComponentLanguage,
} from "../../../../../../hooks";
import StyledLink from "../../../../../common/navigate/StyledLink";

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
  const lang = useComponentLanguage("NotificationExposed");
  const data = toExposed(group);
  const authContext = useAuthContext();
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
            <Avatar
              sx={{ width: "100%", height: "100%" }}
              src={authContext.account?.avatar}
            />
          </SquareContainer>
        </Box>
        <Typography>{lang("food-like", data.users.length)}</Typography>
      </Stack>
    </StyledLink>
  );
});

export default NotificationFoodLike;
