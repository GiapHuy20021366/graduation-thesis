import React from "react";
import { Avatar, AvatarProps, Badge, BadgeProps, Tooltip } from "@mui/material";
import { IFoodPostExposed } from "../../data";
import { deepOrange } from "@mui/material/colors";

type FoodAvatarsProps = AvatarProps & {
  BadgeProps?: BadgeProps;
  SecondaryAvatarProps?: AvatarProps;
  food: IFoodPostExposed;
};

const toAuthorName = (food: IFoodPostExposed): string => {
  const author = food.user;
  if (author && typeof author === "object") {
    return author.firstName + " " + author.lastName;
  }
  return "SYSTEM_USER";
};

const toPlaceName = (food: IFoodPostExposed): string => {
  const place = food.place;
  if (place && typeof place === "object") {
    return place.exposeName;
  }
  return "SYSTEM_PLACE";
};

const FoodAvatars = React.forwardRef<HTMLDivElement, FoodAvatarsProps>(
  (props, ref) => {
    const { BadgeProps, SecondaryAvatarProps, food, ...rest } = props;

    const author = food.user;
    const place = food.place;
    const placeName = toPlaceName(food);
    const authorName = toAuthorName(food);
    const placeAvatar = typeof place === "object" ? place.avatar : undefined;
    const authorAvatar = typeof author === "object" ? author.avatar : undefined;

    if (place != null) {
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <Tooltip title={placeName}>
              <Avatar
                alt={placeName}
                src={placeAvatar}
                {...SecondaryAvatarProps}
                sx={{
                  width: 22,
                  height: 22,
                  border: "2px solid",
                  borderColor: "background.paper",
                  bgcolor: deepOrange[500],
                  cursor: "pointer",
                  ...SecondaryAvatarProps?.sx,
                }}
              >
                {placeName[0]}
              </Avatar>
            </Tooltip>
          }
          {...BadgeProps}
        >
          <Tooltip title={authorName}>
            <Avatar
              ref={ref}
              alt={authorName}
              src={authorAvatar}
              {...rest}
              sx={{
                cursor: "pointer",
                ...rest.sx,
              }}
            >
              {authorName[0]}
            </Avatar>
          </Tooltip>
        </Badge>
      );
    }

    return (
      <Tooltip title={authorName}>
        <Avatar
          ref={ref}
          alt={authorName}
          src={authorAvatar}
          {...rest}
          sx={{
            cursor: "pointer",
            ...rest.sx,
          }}
        >
          {authorName[0]}
        </Avatar>
      </Tooltip>
    );
  }
);

export default FoodAvatars;
