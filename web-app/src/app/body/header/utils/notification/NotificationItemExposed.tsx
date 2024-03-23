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
        ...(rest.sx ?? {}),
        ":hover": {
          boxShadow: 1,
        },
        backgroundColor: read ? "white" : "#F2F6FC",
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
        <NotificationPlaceInactive group={group} key={group._id} />
      )}
      {type === NotificationType.PLACE_RATING && (
        <NotificationPlaceRating group={group} key={group._id} />
      )}
      {type === NotificationType.PLACE_REPORT && (
        <NotificationPlaceReport group={group} key={group._id} />
      )}
      {type === NotificationType.USER_PERSONAL_NEED_UPDATE && (
        <NotificationdUserPersonal group={group} key={group._id} />
      )}
      {type === NotificationType.USER_WELLCOME && (
        <NotificationdUserWelcome group={group} key={group._id} />
      )}
    </Stack>
  );
});

export default NotificationItemExposed;
