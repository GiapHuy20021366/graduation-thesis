import React from "react";
import { Avatar, Stack, StackProps, Typography } from "@mui/material";
import { IPlaceExposedCooked } from "../../../data";
import PlaceViewerExposedType from "../viewer/PlaceViewerExposedType";
import {
  LocationOnOutlined,
  SocialDistanceOutlined,
  StarBorderOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

type PlaceSearchItemProps = StackProps & {
  data: IPlaceExposedCooked;
  onBeforeNavigate?: (id: string) => void;
};

const PlaceSearchItem = React.forwardRef<HTMLDivElement, PlaceSearchItemProps>(
  (props, ref) => {
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
          <Stack direction="row" gap={1}>
            <StarBorderOutlined color="secondary" />
            <Typography>
              {data.rating.count} lượt, đánh giá {data.rating.mean}/5.0
            </Typography>
          </Stack>

          <Stack gap={1} direction={"row"}>
            <SocialDistanceOutlined color="info" />
            <Typography>{data.currentDistance ?? 0} Kms</Typography>
          </Stack>
          <Stack gap={1} direction={"row"}>
            <LocationOnOutlined color="success" />
            <Typography>{data.location.name}</Typography>
          </Stack>
        </Stack>
      </Stack>
    );
  }
);

export default PlaceSearchItem;
