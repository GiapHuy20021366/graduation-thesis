import React from "react";
import { Avatar, AvatarProps, Badge, BadgeProps, Tooltip } from "@mui/material";
import { deepOrange } from "@mui/material/colors";
import StyledLink from "../../navigate/StyledLink";
import { IFoodPostExposed } from "../../../../data";

type FoodAvatarsProps = AvatarProps & {
  BadgeProps?: BadgeProps;
  SecondaryAvatarProps?: AvatarProps;
  food: IFoodPostExposed;
  navigate?: boolean;
  onBeforeNavigate?: () => void;
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
  if (place && typeof place === "object" && place.exposeName) {
    return place.exposeName;
  }
  return "SYSTEM_PLACE";
};

const FoodAvatars = React.forwardRef<HTMLDivElement, FoodAvatarsProps>(
  (props, ref) => {
    const {
      BadgeProps,
      SecondaryAvatarProps,
      food,
      navigate,
      onBeforeNavigate,
      ...rest
    } = props;

    const author = food.user;
    const place = food.place;
    const placeName = toPlaceName(food);
    const authorName = toAuthorName(food);
    const placeAvatar = typeof place === "object" ? place.avatar : undefined;
    const authorAvatar = typeof author === "object" ? author.avatar : undefined;

    const authorId = typeof author === "string" ? author : author._id;

    if (place != null) {
      const placeId = typeof place === "string" ? place : place._id;
      return (
        <Badge
          overlap="circular"
          anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          badgeContent={
            <StyledLink
              to={navigate ? `/place/${placeId}` : "#"}
              onClick={() => {
                navigate && onBeforeNavigate && onBeforeNavigate();
              }}
            >
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
                    ...SecondaryAvatarProps?.sx,
                  }}
                >
                  {placeName[0]}
                </Avatar>
              </Tooltip>
            </StyledLink>
          }
          {...BadgeProps}
        >
          <StyledLink
            to={navigate ? `/user/${authorId}` : "#"}
            onClick={() => {
              navigate && onBeforeNavigate && onBeforeNavigate();
            }}
          >
            <Tooltip title={authorName}>
              <Avatar ref={ref} alt={authorName} src={authorAvatar} {...rest}>
                {authorName[0]}
              </Avatar>
            </Tooltip>
          </StyledLink>
        </Badge>
      );
    }

    return (
      <StyledLink
        to={navigate ? `/user/${authorId}` : "#"}
        onClick={() => {
          navigate && onBeforeNavigate && onBeforeNavigate();
        }}
      >
        <Tooltip title={authorName}>
          <Avatar ref={ref} alt={authorName} src={authorAvatar} {...rest}>
            {authorName[0]}
          </Avatar>
        </Tooltip>
      </StyledLink>
    );
  }
);

export default FoodAvatars;
