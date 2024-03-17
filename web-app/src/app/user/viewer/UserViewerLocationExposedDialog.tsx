import React from "react";
import { Box, Button, Dialog, DialogProps } from "@mui/material";
import { ILocation } from "../../../data";
import LocationExposed from "../../common/custom/LocationExposed";
import UserViewerMapExposedContent from "./UserViewerMapExposedContent";

type UserViewerLocationExposedDialogProps = DialogProps & {
  currentLocation?: ILocation;
  targetLocation?: ILocation;
  homeLocation?: ILocation;
  onCloseClick?: () => void;
};

const PlaceViewerLocationExposedDialog = React.forwardRef<
  HTMLDivElement,
  UserViewerLocationExposedDialogProps
>((props, ref) => {
  const {
    currentLocation,
    targetLocation,
    homeLocation,
    onCloseClick,
    ...rest
  } = props;
  return (
    <Dialog ref={ref} fullScreen {...rest}>
      <Box position={"relative"} width={"100%"} height={"100%"}>
        <Button
          variant="contained"
          onClick={() => onCloseClick && onCloseClick()}
        >
          Đóng
        </Button>
        <LocationExposed
          targetLocation={targetLocation}
          homeLocation={homeLocation}
          currentLocation={currentLocation}
          height={"100%"}
          infoContent={<UserViewerMapExposedContent />}
        />
      </Box>
    </Dialog>
  );
});

export default PlaceViewerLocationExposedDialog;
