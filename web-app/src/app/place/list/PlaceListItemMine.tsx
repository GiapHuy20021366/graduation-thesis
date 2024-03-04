import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { IPlaceExposedCooked } from "../../../data";
import PlaceViewerExposedType from "../viewer/PlaceViewerExposedType";
import {
  AccessTimeOutlined,
  LocationOnOutlined,
  StarBorderOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router";
import TimeExposed from "../../common/custom/TimeExposed";

type PlaceListItemMineProps = StackProps & {
  data: IPlaceExposedCooked;
  onBeforeNavigate?: (id: string) => void;
};

const PlaceListItemMine = React.forwardRef<
  HTMLDivElement,
  PlaceListItemMineProps
>((props, ref) => {
  const { data, onBeforeNavigate, ...rest } = props;
  const navigate = useNavigate();

  const handleNavigate = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    onBeforeNavigate && onBeforeNavigate(data._id);
    props.onClick && props.onClick(event);
    navigate(`/place/${data._id}`);
  };

  return (
    <Stack
      ref={ref}
      direction={"row"}
      {...rest}
      sx={{
        width: "100%",
        gap: 1,
        py: 1,
        alignItems: "center",
        cursor: "pointer",
        ...(props.sx ?? {}),
      }}
      onClick={handleNavigate}
    >
      <Avatar
        sx={{
          width: [90, 120, 150, 180],
          height: [90, 120, 150, 180],
          cursor: "pointer",
          boxShadow: 5,
        }}
        src={data.avartar}
      >
        {data.exposeName[0]}
      </Avatar>
      <Stack gap={1} flex={1}>
        <Typography sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2 }}>
          {data.exposeName}
        </Typography>

        <PlaceViewerExposedType placeType={data.type} />
        <Stack gap={1} direction={"row"}>
          <AccessTimeOutlined color="success" />
          <Typography>
            Đã tạo vào <TimeExposed time={data.updatedAt} />
          </Typography>
        </Stack>
        <Stack direction="row" gap={1}>
          <StarBorderOutlined color="secondary" />
          <Typography>
            {data.rating.count} lượt, đánh giá {data.rating.mean.toFixed(1)}/5.0
          </Typography>
        </Stack>
        <Stack gap={1} direction={"row"}>
          <LocationOnOutlined color="success" />
          <Typography>{data.location.name}</Typography>
        </Stack>
      </Stack>
    </Stack>
  );
});

export default PlaceListItemMine;
