import React from "react";
import { Avatar, Box, Stack, StackProps, Typography } from "@mui/material";
import { Person } from "@mui/icons-material";
import { IFoodPostExposed, SystemSide } from "../../../../data";
import TimeExposed from "../../custom/TimeExposed";
import { useComponentLanguage } from "../../../../hooks";
import StyledLink from "../../navigate/StyledLink";

type SharedFoodProps = StackProps & {
  data: IFoodPostExposed;
  source?: SystemSide;
  onBeforeNavigate?: () => void;
};

const toExposedAuthor = (data: IFoodPostExposed): string => {
  const author = data.user;
  if (typeof author !== "object") return "SYSTEM_USER";
  else return author.firstName + " " + author.lastName;
};

const toAuthorId = (data: IFoodPostExposed): string => {
  const author = data.user;
  return typeof author === "string" ? author : author._id;
};

const toExposedPlace = (data: IFoodPostExposed): string | undefined => {
  const place = data.place;
  if (place != null) {
    if (typeof place === "string") {
      return undefined;
    } else {
      return place.exposeName;
    }
  }
};

const toPlaceId = (data: IFoodPostExposed): string | undefined => {
  const place = data.place;
  if (place != null) {
    return typeof place === "string" ? place : place._id;
  }
};

const toNavigate = (data: IFoodPostExposed, source?: SystemSide) => {
  const exposedAuthor = toExposedAuthor(data);
  const authorId = toAuthorId(data);
  const placeId = toPlaceId(data);
  const exposedPlace = toExposedPlace(data);
  if (source === SystemSide.USER && placeId != null) {
    // target go to place
    return {
      url: "/place/" + placeId,
      name: exposedPlace,
    };
  }

  //   default go to user
  return {
    url: "/user/" + authorId,
    name: exposedAuthor,
  };
};

const SharedFood = React.forwardRef<HTMLDivElement, SharedFoodProps>(
  (props, ref) => {
    const { data, source, onBeforeNavigate, ...rest } = props;
    const lang = useComponentLanguage("ViewerData");

    const isExpired = Date.now() - new Date(data.duration).getTime() < 0;
    const navigateAction = toNavigate(data, source);

    return (
      <Stack
        ref={ref}
        direction={"row"}
        gap={1}
        {...rest}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <StyledLink
          to={`/food/${data._id}`}
          onBeforeNavigate={onBeforeNavigate}
        >
          <Box sx={{ width: 85, height: 85 }}>
            <Avatar sx={{ width: "100%", height: "100%" }} src={data.images[0]}>
              {data.title[0]}
            </Avatar>
          </Box>
        </StyledLink>

        <Stack>
          <StyledLink
            to={`/food/${data._id}`}
            onBeforeNavigate={onBeforeNavigate}
          >
            <Typography sx={{ fontWeight: 450 }}>{data.title}</Typography>
          </StyledLink>

          <StyledLink
            to={navigateAction.url}
            onBeforeNavigate={onBeforeNavigate}
          >
            <Stack direction={"row"} gap={1}>
              <Person color="info" />
              <Typography>{navigateAction.name}</Typography>
            </Stack>
          </StyledLink>

          <Typography>
            {lang("added-at")} <TimeExposed time={data.createdAt} />
          </Typography>
          <Typography>
            {isExpired ? lang("will-expired-at") : lang("expired-at")}
            <TimeExposed time={data.duration} />
          </Typography>
        </Stack>
      </Stack>
    );
  }
);

export default SharedFood;
