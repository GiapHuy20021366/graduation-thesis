import React from "react";
import { Avatar, Box, Stack, StackProps, Typography } from "@mui/material";
import { IPlaceExposedCooked } from "../../../data";
import PlaceViewerExposedType from "../viewer/PlaceViewerExposedType";
import {
  LocationOnOutlined,
  SocialDistanceOutlined,
  StarBorderOutlined,
} from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";
import { useComponentLanguage } from "../../../hooks";

type PlaceSearchItemProps = StackProps & {
  data: IPlaceExposedCooked;
  onBeforeNavigate?: (id: string) => void;
};

const PlaceSearchItem = React.forwardRef<HTMLDivElement, PlaceSearchItemProps>(
  (props, ref) => {
    const { data, onBeforeNavigate, ...rest } = props;
    const lang = useComponentLanguage();
    return (
      <Stack
        ref={ref}
        direction={"row"}
        {...rest}
        sx={{
          width: "100%",
          gap: [1, 2, 3],
          py: 1,
          alignItems: "center",
          ...(props.sx ?? {}),
        }}
      >
        <Box sx={{ width: [90, 120, 150, 180], height: [90, 120, 150, 180] }}>
          <StyledLink
            to={`/place/${data._id}`}
            onBeforeNavigate={() =>
              onBeforeNavigate && onBeforeNavigate(data._id)
            }
          >
            <Avatar
              sx={{
                boxShadow: 5,
                width: "100%",
                height: "100%",
              }}
              src={data.avatar}
            >
              {data.exposedName[0]}
            </Avatar>
          </StyledLink>
        </Box>
        <Stack gap={1} flex={1}>
          <StyledLink
            to={`/place/${data._id}`}
            onBeforeNavigate={() =>
              onBeforeNavigate && onBeforeNavigate(data._id)
            }
          >
            <Typography sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2 }}>
              {data.exposedName}
            </Typography>
          </StyledLink>

          <PlaceViewerExposedType placeType={data.type} />
          <Stack direction="row" gap={1}>
            <StarBorderOutlined color="secondary" />
            <Typography>
              {lang(
                "rated-point",
                data.rating.count,
                data.rating.mean.toFixed(1),
                "5.0"
              )}
            </Typography>
          </Stack>

          <Stack gap={1} direction={"row"}>
            <SocialDistanceOutlined color="info" />
            <Typography>
              {lang(
                "distance-x",
                ((data.currentDistance ?? 0) * 1000).toFixed(0),
                "m"
              )}
            </Typography>
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
