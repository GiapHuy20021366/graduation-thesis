import React from "react";
import { Stack, StackProps } from "@mui/material";
import { INotificationGroup, NotificationType } from "../../../../../data";
import NotificationFoodExpired from "./exposed/NotificationFoodExpired";
import NotificationFoodNearExpired from "./exposed/NotificationFoodNearExpired";
import NotificationFoodLike from "./exposed/NotificationFoodLike";
import NotificationFoodSubcribedPlace from "./exposed/NotificationFoodSubcribedPlace";
import NotificationFoodSubcribedUser from "./exposed/NotificationFoodSubcribedUser";
import NotificationFoodSuggestedAround from "./exposed/NotificationFoodSuggestedAround";
import NotificationFoodSuggestedCategory from "./exposed/NotificationFoodSuggestedCategory";
import NotificationPlaceInactive from "./exposed/NotificationPlaceInactive";
import NotificationPlaceRating from "./exposed/NotificationPlaceRating";
import NotificationPlaceReport from "./exposed/NotificationPlaceReport";
import NotificationdUserPersonal from "./exposed/NotificationUserPersonal";
import NotificationdUserWelcome from "./exposed/NotificationUserWelcome";
import StyledLink from "../../../../common/navigate/StyledLink";
import { applicationPages } from "../../../../../hooks";

type NotificationItemExposedProps = StackProps & {
  group: INotificationGroup;
};

const NotificationItemExposed = React.forwardRef<
  HTMLDivElement,
  NotificationItemExposedProps
>((props, ref) => {
  const { group, ...rest } = props;
  const read = group.read;
  const type = group.type;
  return (
    <Stack
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...rest.sx,
        gap: 1,
        backgroundColor: read ? "inherit" : "action.hover",
        ":hover": {
          backgroundColor: read ? "#242526" : undefined,
        },
        cursor: "pointer",
      }}
    >
      {type === NotificationType.FOOD_EXPIRED && (
        <NotificationFoodExpired group={group} key={group._id} />
      )}
      {type === NotificationType.FOOD_LIKED && (
        <NotificationFoodLike group={group} key={group._id} />
      )}
      {type === NotificationType.FOOD_NEAR_EXPIRED && (
        <NotificationFoodNearExpired group={group} key={group._id} />
      )}

      {type === NotificationType.FOOD_SUBCRIBED_PLACE && (
        <NotificationFoodSubcribedPlace group={group} key={group._id} />
      )}
      {type === NotificationType.FOOD_SUBCRIBED_USER && (
        <NotificationFoodSubcribedUser group={group} key={group._id} />
      )}
      {type === NotificationType.FOOD_SUGGESTED_AROUND && (
        <NotificationFoodSuggestedAround group={group} key={group._id} />
      )}
      {type === NotificationType.FOOD_SUGGESTED_CATEGORY && (
        <NotificationFoodSuggestedCategory group={group} key={group._id} />
      )}
      {type === NotificationType.PLACE_INACTIVE && (
        <StyledLink
          to={applicationPages.PLACE_VIEWER.replace(
            ":id",
            group.datas[0].typedPlace!
          )}
          key={group._id}
        >
          <NotificationPlaceInactive group={group} key={group._id} />
        </StyledLink>
      )}
      {type === NotificationType.PLACE_RATING && (
        <StyledLink
          to={applicationPages.PLACE_VIEWER.replace(
            ":id",
            group.datas[0].typedPlace!
          )}
          key={group._id}
        >
          <NotificationPlaceRating group={group} key={group._id} />
        </StyledLink>
      )}
      {type === NotificationType.PLACE_REPORT && (
        <StyledLink
          to={applicationPages.PLACE_VIEWER.replace(
            ":id",
            group.datas[0].typedPlace!
          )}
          key={group._id}
        >
          <NotificationPlaceReport group={group} key={group._id} />
        </StyledLink>
      )}
      {type === NotificationType.USER_PERSONAL_NEED_UPDATE && (
        <StyledLink to={applicationPages.USER} key={group._id}>
          <NotificationdUserPersonal group={group} key={group._id} />
        </StyledLink>
      )}
      {type === NotificationType.USER_WELLCOME && (
        <StyledLink to={applicationPages.USER} key={group._id}>
          <NotificationdUserWelcome group={group} key={group._id} />
        </StyledLink>
      )}
    </Stack>
  );
});

export default NotificationItemExposed;
