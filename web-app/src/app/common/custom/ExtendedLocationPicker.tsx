import React, { useCallback, useEffect, useRef, useState } from "react";
import { Box, Button, Chip, Stack, StackProps, TextField } from "@mui/material";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { CenterFocusStrongOutlined } from "@mui/icons-material";
import { geocodeMapFindAddess } from "../../../api";
import {
  ICoordinates,
  ILocation,
  GeoCodeMapsData,
  mapIcons,
} from "../../../data";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { useAuthContext } from "../../../hooks";

const isDiffLocation = (pos1: ICoordinates, pos2?: ICoordinates): boolean => {
  if (pos2 == null) return true;
  return pos1.lat !== pos2.lat || pos1.lng !== pos2.lng;
};

type ExtendedLocationPickerProps = StackProps & {
  defaultLocation?: ILocation;
  onSetLocation?: (newLocation: ILocation) => void;
};

const ExtendedLocationPicker = React.forwardRef<
  HTMLDivElement,
  ExtendedLocationPickerProps
>((props, ref) => {
  const { defaultLocation, onSetLocation, ...rest } = props;

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
  const [locationName, setLocationName] = useState<string>(
    defaultLocation?.name ?? "My current location"
  );
  const [fetching, setFetching] = useState<boolean>(false);
  const [lastFetchedPos, setLastFetchedPos] = useState<
    ICoordinates | undefined
  >(defaultLocation?.coordinates);
  const timeout = useRef<number>();
  const authContext = useAuthContext();
  const [home, setHome] = useState<ILocation>();

  const fetchAddress = useCallback((pos: ICoordinates) => {
    const timeOutId = timeout.current;
    if (timeOutId != null) {
      clearTimeout(timeOutId);
      setFetching(false);
      timeout.current = undefined;
    }
    setFetching(true);
    timeout.current = setTimeout(() => {
      try {
        geocodeMapFindAddess(pos).then((data: GeoCodeMapsData | null) => {
          if (data != null) {
            const address = data.displayName;
            setLocationName(address);
            setLastFetchedPos(pos);
          } else {
            console.log("Cannot find the location name");
          }
        });
      } catch (error) {
        console.error("Error fetching location information:", error);
      } finally {
        setFetching(false);
      }
    }, 1000);
  }, []);

  useEffect(() => {
    if (
      lastFetchedPos == null ||
      selected == null ||
      selected.lat !== lastFetchedPos.lat ||
      selected.lng !== lastFetchedPos.lng
    ) {
      selected && fetchAddress(selected);
    }
  }, [fetchAddress, lastFetchedPos, selected]);

  const setCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setSelected(pos);
        },
        (error: GeolocationPositionError) => {
          console.log(error);
        }
      );
    }
  };

  useEffect(() => {
    if (!props.defaultLocation) {
      setCurrentLocation();
    }
  }, [props.defaultLocation]);

  const handleLocateMe = () => {
    setCenter({ ...center });
    setSelected({ ...center });
    setInfoOpen(true);
  };

  const handleOpenInfo = () => {
    setInfoOpen(!infoOpen);
  };

  const handleSetMyLocation = () => {
    onSetLocation &&
      selected &&
      onSetLocation({
        name: locationName,
        coordinates: selected,
      });
  };

  useEffect(() => {
    const userLocation = authContext.account?.location;
    if (userLocation != null && home == null) {
      setHome(userLocation);
    }
  }, [authContext.account, home]);

  const handleMapClick = (e: google.maps.MapMouseEvent) => {
    const latLng = e.latLng;
    if (latLng) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setSelected({ lat, lng });
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
          value={fetching ? "Loading..." : locationName}
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
            {selected && isDiffLocation(selected, home?.coordinates) && (
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
                        onClick={handleSetMyLocation}
                      >
                        Đặt vị trí
                      </Button>
                    </Box>
                  </InfoWindowF>
                )}
              </MarkerF>
            )}
            {home != null && (
              <MarkerF
                icon={{
                  url: mapIcons.homeGreen,
                  scaledSize: new google.maps.Size(40, 40),
                }}
                position={home.coordinates}
              >
                <InfoWindowF position={home.coordinates}>
                  <Box sx={{ width: 200 }}></Box>
                </InfoWindowF>
              </MarkerF>
            )}
          </GoogleMap>
        )}
      </Box>
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
        disabled={fetching}
        onClick={handleSetMyLocation}
      />
    </Stack>
  );
});

export default ExtendedLocationPicker;
