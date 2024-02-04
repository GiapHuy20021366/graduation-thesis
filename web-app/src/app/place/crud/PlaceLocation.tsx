import React, { useEffect, useState } from "react";
import {
  Box,
  BoxProps,
  Dialog,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import {
  useFetchLocation,
  useI18nContext,
  usePlaceEditContext,
} from "../../../hooks";
import ExtendedLocationPicker from "../../common/custom/ExtendedLocationPicker";
import { ILocation } from "../../../data";
import { KeyboardArrowRight } from "@mui/icons-material";

type PlaceLocationProps = BoxProps;

const PlaceLocation = React.forwardRef<HTMLDivElement, PlaceLocationProps>(
  (props, ref) => {
    const editContext = usePlaceEditContext();
    const { location, setLocation } = editContext;
    const [open, setOpen] = useState<boolean>(false);

    const i18nContext = useI18nContext();
    const lang = i18nContext.of(PlaceLocation);

    const fetchLocation = useFetchLocation({ defaultLocation: location });

    const handleSetLocation = (location: ILocation) => {
      setOpen(false);
      setLocation(location);
    };

    useEffect(() => {
      if (fetchLocation.location == null) {
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(
            (position: GeolocationPosition) => {
              const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              fetchLocation.fetch(pos, {
                onSuccess: (location) => {
                  console.log(location);
                  setLocation(location);
                },
              });
            },
            (error: GeolocationPositionError) => {
              console.log(error);
            }
          );
        }
      }
    }, [fetchLocation, location, setLocation]);

    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
          }}
        >
          <h4>{lang("Location")}</h4>
          <IconButton
            color="primary"
            sx={{
              marginLeft: "auto",
            }}
            onClick={() => setOpen(true)}
          >
            <KeyboardArrowRight />
          </IconButton>
        </Stack>
        <Divider />
        <Stack direction={"row"}>
          <Box sx={{ padding: "8px 0" }}>
            {location?.name ?? "Please choose an location"}
          </Box>
        </Stack>
        <Dialog open={open} fullScreen>
          <ExtendedLocationPicker
            height={"100%"}
            defaultLocation={location}
            onSetLocation={handleSetLocation}
            onCloseClick={() => setOpen(false)}
          />
        </Dialog>
      </Box>
    );
  }
);

export default PlaceLocation;
