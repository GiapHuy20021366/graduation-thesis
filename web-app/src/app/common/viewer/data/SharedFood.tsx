import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { Person } from "@mui/icons-material";
import { IFoodPostExposed, SystemSide } from "../../../../data";
import TimeExposed from "../../custom/TimeExposed";

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
    const navigate = useNavigate();

    const isExpired = Date.now() - new Date(data.duration).getTime() < 0;
    const navigateAction = toNavigate(data, source);

    const handleNavigate = () => {
      onBeforeNavigate && onBeforeNavigate();
      navigate("/food/" + data._id);
    };

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
        <Avatar sx={{ width: 85, height: 85 }} src={data.images[0]}>
          {data.title[0]}
        </Avatar>
        <Stack>
          <Typography
            sx={{ fontWeight: 450, cursor: "pointer" }}
            onClick={handleNavigate}
          >
            {data.title}
          </Typography>
          <Stack
            direction={"row"}
            gap={1}
            sx={{ cursor: "pointer" }}
            onClick={() => navigate(navigateAction.url)}
          >
            <Person color="info" />
            <Typography>{navigateAction.name}</Typography>
          </Stack>
          <Typography>
            Được thêm vào <TimeExposed time={data.createdAt} />
          </Typography>
          <Typography>
            {isExpired ? "Sẽ hết hạn vào " : "Đã hết hạn vào "}
            <TimeExposed time={data.duration} />
          </Typography>
        </Stack>
      </Stack>
    );
  }
);

export default SharedFood;
