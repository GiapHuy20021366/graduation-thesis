import React from "react";
import {
  Avatar,
  Box,
  BoxProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { IPlaceExposed } from "../../../data";
import PlaceImageHolder from "../crud/PlaceImageHolder";
import PlaceRating from "./PlaceRating";
import PlaceButtonContextMenu from "./PlaceButtonContextMenu";
import { NotificationsActiveOutlined } from "@mui/icons-material";

type PlaceViewerHeaderProps = BoxProps & {
  place: IPlaceExposed;
};

const PlaceViewerHeader = React.forwardRef<
  HTMLDivElement,
  PlaceViewerHeaderProps
>((props, ref) => {
  const { place, ...rest } = props;
  const { images, exposeName } = place;
  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        position: "relative",
        ...(props.sx ?? {}),
      }}
    >
      <Box width={"100%"} position={"relative"}>
        <Carousel
          autoPlay={false}
          animation="slide"
          cycleNavigation
          fullHeightHover
          navButtonsAlwaysVisible
          sx={{
            backgroundColor: "white",
            width: "100%",
            height: "230px",
          }}
        >
          {images.map((url) => {
            return (
              <PlaceImageHolder
                sx={{
                  width: "100%",
                }}
                key={url}
                imgSrc={url}
              />
            );
          })}
        </Carousel>
      </Box>

      <Stack direction={"row"} gap={1}>
        <Avatar
          sx={{
            width: [90, 120, 150, 180],
            height: [90, 120, 150, 180],
            transform: "translateY(-50%)",
            zIndex: 1000,
            boxShadow: 5,
          }}
          src={place.avartar}
        >
          H
        </Avatar>
        <Typography sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2 }}>
          {exposeName}
        </Typography>
      </Stack>

      <Stack direction={"row"} sx={{ alignItems: "center" }}>
        <Typography>0 đang theo dõi</Typography>
        <IconButton color="success">
          <NotificationsActiveOutlined />
        </IconButton>
      </Stack>

      <Stack direction={"row"}>
        <PlaceRating data={place} />
        <Tooltip title="Xem thêm">
          <PlaceButtonContextMenu data={place} />
        </Tooltip>
      </Stack>
    </Box>
  );
});

export default PlaceViewerHeader;
