import React, { useCallback, useEffect, useState } from "react";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  StackProps,
  TextField,
  Tooltip,
} from "@mui/material";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { CenterFocusStrongOutlined, CloseOutlined } from "@mui/icons-material";
import { ICoordinates, ILocation, mapIcons } from "../../../data";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { RequestStatus, useFetchLocation } from "../../../hooks";

type ExtendedLocationPickerProps = StackProps & {
  defaultLocation?: ILocation;
  onSetLocation?: (newLocation: ILocation) => void;
  onCloseClick?: () => void;
  homeLocation?: ILocation;
};

const ExtendedLocationPicker = React.forwardRef<
  HTMLDivElement,
  ExtendedLocationPickerProps
>((props, ref) => {
  const {
    defaultLocation,
    onSetLocation,
    onCloseClick,
    homeLocation,
    ...rest
  } = props;

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [center, setCenter] = useState<ICoordinates>(
    defaultLocation?.coordinates ?? {
      lat: 0,
      lng: 0,
    }
  );
  const [selected, setSelected] = useState<ICoordinates | undefined>(
    defaultLocation?.coordinates
  );
  const [infoOpen, setInfoOpen] = useState<boolean>(false);

  const fetchLocation = useFetchLocation({ defaultLocation });

  const handleSetLocation = () => {
    const fetchedLocation = fetchLocation.location;
    if (fetchedLocation) {
      onSetLocation && onSetLocation(fetchedLocation);
    }
  };

  const setCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          fetchLocation.fetch(pos, {
            onSuccess: (location) => {
              setSelected(location.coordinates);
            },
          });
        },
        (error: GeolocationPositionError) => {
          console.log(error);
        }
      );
    }
  }, [fetchLocation]);

  useEffect(() => {
    if (fetchLocation.location == null) {
      setCurrentLocation();
    }
  }, [fetchLocation.location, setCurrentLocation]);

  const handleLocateMe = () => {
    setCenter({ ...center });
    setInfoOpen(true);
    fetchLocation.fetch(center, {
      onSuccess: () => {
        setSelected(center);
      },
    });
  };

  const handleOpenInfo = () => {
    setInfoOpen(!infoOpen);
  };

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const latLng = e.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      const pos = {
        lat,
        lng,
      };
      fetchLocation.fetch(pos, {
        onSuccess: (location) => {
          setSelected(location.coordinates);
        },
      });
    }
  };

  return (
    <Stack
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <Box width={"100%"}>
        <TextField
          label={"Location"}
          variant="standard"
          fullWidth
          InputProps={{
            readOnly: true,
          }}
          multiline
          value={
            fetchLocation.status === RequestStatus.INCHING
              ? "Loading..."
              : fetchLocation.location?.name
          }
        />
      </Box>
      <Box sx={{ width: "100%", flex: 1 }}>
        {isLoaded && (
          <GoogleMap
            center={center}
            zoom={16}
            mapContainerStyle={{
              width: "100%",
              height: "100%",
              boxSizing: "border-box",
            }}
            onClick={handleMapClick}
          >
            {selected && (
              <MarkerF
                icon={{
                  url: mapIcons.homePin,
                  scaledSize: new google.maps.Size(40, 40),
                }}
                position={selected}
                onClick={handleOpenInfo}
              >
                {infoOpen && (
                  <InfoWindowF
                    position={selected}
                    onCloseClick={handleOpenInfo}
                  >
                    <Box sx={{ width: 200 }}>
                      <span>Vị trí đã chọn</span>
                      <Button
                        sx={{ width: "100%", textAlign: "center" }}
                        onClick={handleSetLocation}
                      >
                        Đặt vị trí
                      </Button>
                    </Box>
                  </InfoWindowF>
                )}
              </MarkerF>
            )}
            {homeLocation != null && (
              <MarkerF
                icon={{
                  url: mapIcons.homeGreen,
                  scaledSize: new google.maps.Size(40, 40),
                }}
                position={homeLocation.coordinates}
              >
                <InfoWindowF position={homeLocation.coordinates}>
                  <Box sx={{ width: 200 }}>Nhà của bạn</Box>
                </InfoWindowF>
              </MarkerF>
            )}
          </GoogleMap>
        )}
      </Box>
      <IconButton
        sx={{
          position: "absolute",
          zIndex: 1000,
          right: 10,
          top: 126,
          backgroundColor: "white",
        }}
        color="error"
        onClick={() => onCloseClick && onCloseClick()}
      >
        <Tooltip title="close">
          <CloseOutlined />
        </Tooltip>
      </IconButton>
      <Chip
        label={"Locate Me"}
        sx={{
          position: "absolute",
          bottom: 80,
          zIndex: 1000,
          backgroundColor: "purple",
          width: "fit-content",
          px: 5,
          fontWeight: 600,
          fontSize: "1.3rem",
          color: "white",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          ":hover": {
            backgroundColor: "white",
            color: "black",
          },
        }}
        onClick={handleLocateMe}
        icon={<CenterFocusStrongOutlined color="inherit" />}
      />
      <Chip
        label={"Set Location"}
        sx={{
          position: "absolute",
          bottom: 40,
          zIndex: 1000,
          backgroundColor: "purple",
          width: "fit-content",
          px: 5,
          fontWeight: 600,
          fontSize: "1.3rem",
          color: "white",
          left: "50%",
          transform: "translateX(-50%)",
          cursor: "pointer",
          ":hover": {
            backgroundColor: "white",
            color: "black",
          },
        }}
        disabled={fetchLocation.status === RequestStatus.INCHING}
        onClick={handleSetLocation}
      />
    </Stack>
  );
});

export default ExtendedLocationPicker;
