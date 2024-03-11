import React, { useState } from "react";
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
import PlaceButtonContextMenu from "./PlaceButtonContextMenu";
import { NotificationsActiveOutlined } from "@mui/icons-material";
import SubcribeChipAction from "./SubcribeChipAction";
import PlaceViewerRating from "./PlaceViewerRating";
import PlaceViewerExposedType from "./PlaceViewerExposedType";

type PlaceViewerHeaderProps = BoxProps & {
  place: IPlaceExposed;
};

const PlaceViewerHeader = React.forwardRef<
  HTMLDivElement,
  PlaceViewerHeaderProps
>((props, ref) => {
  const { place, ...rest } = props;
  const { images, exposeName } = place;

  const [subribedCount, setSubcribedCount] = useState<number>(
    place.subcribers ?? 0
  );

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
          src={place.avatar}
        >
          {place.exposeName.charAt(0)}
        </Avatar>
        <Stack gap={1} flex={1}>
          <Typography sx={{ fontWeight: 500, fontSize: "1.3rem", mt: 2 }}>
            {exposeName}
          </Typography>

          <PlaceViewerExposedType placeType={place.type} />

          <Stack direction={"row"} sx={{ alignItems: "center" }} ml={-1}>
            <IconButton color="success">
              <NotificationsActiveOutlined />
            </IconButton>
            <Typography>{subribedCount} đang theo dõi</Typography>
            <SubcribeChipAction
              onFollowed={() => setSubcribedCount(subribedCount + 1)}
              onUnFollowed={() =>
                setSubcribedCount(Math.max(subribedCount - 1, 0))
              }
              data={place}
              sx={{ ml: 2 }}
            />
            <Box ml={"auto"}>
              <Tooltip title="Xem thêm">
                <PlaceButtonContextMenu
                  data={place}
                  sx={{ flex: 1 }}
                  color="primary"
                />
              </Tooltip>
            </Box>
          </Stack>
          {/* Rating */}
          <PlaceViewerRating data={place} mt={1} ml={-1} />
        </Stack>
      </Stack>
    </Box>
  );
});

export default PlaceViewerHeader;
