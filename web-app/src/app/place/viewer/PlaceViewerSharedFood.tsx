import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { IPlaceFoodExposed, toTimeInfo } from "../../../data";
import { useNavigate } from "react-router";
import { Person } from "@mui/icons-material";

type PlaceViewerSharedFoodProps = StackProps & {
  data: IPlaceFoodExposed;
};

const pad = (num: number, p: number = 2): string => {
  let result = String(num);
  while (result.length < p) {
    result = "0" + result;
  }
  return result;
};

const toDisplayTime = (time: string | number): string => {
  const times = toTimeInfo(time);
  return (
    pad(times.day) +
    "/" +
    pad(times.month) +
    "/" +
    pad(times.year, 4) +
    " " +
    pad(times.hours) +
    ":" +
    pad(times.minutes) +
    ":" +
    pad(times.seconds)
  );
};

const PlaceViewerSharedFood = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSharedFoodProps
>((props, ref) => {
  const { data, ...rest } = props;
  const navigate = useNavigate();
  const isExpired = Date.now() - new Date(data.food.duration).getTime() < 0;

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
      <Avatar sx={{ width: 85, height: 85 }} src={data.food.images[0]}>
        {data.food.title[0]}
      </Avatar>
      <Stack>
        <Typography
          sx={{ fontWeight: 450, cursor: "pointer" }}
          onClick={() => navigate("/food/" + data.food._id)}
        >
          {data.food.title}
        </Typography>
        <Stack
          direction={"row"}
          gap={1}
          sx={{ cursor: "pointer" }}
          onClick={() => navigate("/user/" + data.food._id)}
        >
          <Person color="info" />
          <Typography>
            {data.author.firstName} {data.author.lastName}
          </Typography>
        </Stack>
        <Typography>Được thêm vào {toDisplayTime(data.food.time)}</Typography>
        <Typography>
          {isExpired ? "Sẽ hết hạn vào " : "Đã hết hạn vào "}
          {toDisplayTime(data.food.duration)}
        </Typography>
      </Stack>
    </Stack>
  );
});

export default PlaceViewerSharedFood;
