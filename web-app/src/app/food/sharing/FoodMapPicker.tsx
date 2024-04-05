import {
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { memo, useCallback, useEffect, useState } from "react";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
  CenterFocusStrongOutlined,
  KeyboardArrowRight,
} from "@mui/icons-material";
import {
  useAuthContext,
  useComponentLanguage,
  useDistanceCalculation,
  useFetchLocation,
  useFoodSharingFormContext,
} from "../../../hooks";
import {
  ICoordinates,
  ILocation,
  RequestStatus,
  isDiffLocation,
  mapIcons,
} from "../../../data";

const FoodMapPicker = memo(() => {
  const [open, setOpen] = useState<boolean>(false);

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  const authContext = useAuthContext();
  const { auth, account } = authContext;

  const sharingContext = useFoodSharingFormContext();
  const { location, setLocation, isEditable } = sharingContext;

  const [center, setCenter] = useState<ICoordinates>(
    isEditable
      ? location.coordinates
      : {
          lat: 21.02,
          lng: 105.83,
        }
  );

  const fetchLocation = useFetchLocation({
    defaultLocation: isEditable ? location : undefined,
  });

  const [home, setHome] = useState<ILocation>();

  const lang = useComponentLanguage();

  const [infoOpen, setInfoOpen] = useState<number | undefined>(0);

  const distances = useDistanceCalculation();

  const fetchAddress = useCallback(
    (pos: ICoordinates) => {
      const fetcheds = fetchLocation.fetcheds;
      const index = fetcheds.findIndex(
        (f) => f.coordinates.lat === pos.lat && f.coordinates.lng === pos.lng
      );
      if (index !== -1) {
        fetchLocation.setLocation(fetcheds[index]);
      } else {
        fetchLocation.fetch(pos, {
          onSuccess: (fLocation: ILocation) => {
            fetchLocation.setLocation(fLocation);
          },
        });
      }
    },
    [fetchLocation]
  );

  const setCurrentLocation = useCallback(() => {
    const current = distances.currentLocation;
    if (current) {
      setCenter(current.coordinates);
      setInfoOpen(1);
      fetchAddress(current.coordinates);
    }
  }, [distances.currentLocation, fetchAddress]);

  const handleLocateMe = () => {
    const current = distances.currentLocation?.coordinates;
    if (current != null) {
      if (!isDiffLocation(current, account?.location?.coordinates)) {
        setInfoOpen(0);
        return;
      }
    }
    setCurrentLocation();
  };

  const handleOpenInfo = (index: number) => {
    setInfoOpen(infoOpen === index ? undefined : index);
  };

  const handleUseLocation = () => {
    if (auth == null) return;
    const newLocation = fetchLocation.location;
    if (newLocation == null) return;
    setLocation(newLocation);
    setOpen(false);
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

      fetchAddress({ lat, lng });
      setInfoOpen(1);
    }
  };

  const gotoPrev = () => {
    const fetcheds = fetchLocation.fetcheds;
    const current = fetchLocation.location;
    if (current != null) {
      const index = fetcheds.indexOf(current);
      if (index !== -1 && index > 0) {
        const nLocation = fetcheds[index - 1];
        fetchLocation.setLocation(nLocation);
        if (
          !isDiffLocation(nLocation.coordinates, account?.location?.coordinates)
        ) {
          setInfoOpen(0);
        } else {
          setInfoOpen(1);
        }
      }
    }
  };

  const gotoNext = () => {
    const fetcheds = fetchLocation.fetcheds;
    const current = fetchLocation.location;
    if (current != null) {
      const index = fetcheds.indexOf(current);
      if (index <= 0 && index < fetcheds.length - 1) {
        const nLocation = fetcheds[index + 1];
        fetchLocation.setLocation(nLocation);
        if (
          !isDiffLocation(nLocation.coordinates, account?.location?.coordinates)
        ) {
          setInfoOpen(0);
        } else {
          setInfoOpen(1);
        }
      }
    }
  };

  const onMapLoad = (map: google.maps.Map) => {
    if (isEditable) {
      map.setCenter(location.coordinates);
    } else {
      const current = distances.currentLocation?.coordinates;
      if (current) {
        map.setCenter(current);
        fetchLocation.fetch(current, {
          onSuccess: (location) => {
            setLocation(location);
          },
        });
      }
    }
  };

  const locationName =
    fetchLocation.location?.name ?? "Vị trí hiện tại của tôi";
  const selectedLocation = fetchLocation.location;
  const selectedCoordinates = selectedLocation?.coordinates;
  const isFetching = fetchLocation.status === RequestStatus.INCHING;

  return (
    <Box
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        padding: "8px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        <h4>{lang("location")}</h4>
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
      <Typography>
        {location.name ? location.name : lang("my-current-location")}
      </Typography>
      <Dialog open={open} fullScreen keepMounted>
        <Stack
          position={"relative"}
          direction={"column"}
          gap={1}
          width={"100%"}
          height={"100svh"}
          maxHeight={"100%"}
          boxSizing={"border-box"}
          p={0}
          m={0}
        >
          <Button onClick={() => setOpen(false)}>{lang("close")}</Button>
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
                onLoad={onMapLoad}
              >
                {selectedCoordinates &&
                  isDiffLocation(selectedCoordinates, home?.coordinates) && (
                    <MarkerF
                      icon={{
                        url: mapIcons.homePin,
                        scaledSize: new google.maps.Size(40, 40),
                      }}
                      position={selectedCoordinates}
                      onClick={() => {
                        handleOpenInfo(1);
                      }}
                    >
                      {infoOpen === 1 && (
                        <InfoWindowF
                          position={selectedCoordinates}
                          onCloseClick={() => {
                            handleOpenInfo(1);
                          }}
                        >
                          <Box sx={{ width: 300, color: "black" }}>
                            <Typography>
                              {isFetching ? lang("loading") : locationName}
                            </Typography>
                            {isDiffLocation(
                              selectedCoordinates,
                              location.coordinates
                            ) && (
                              <Button
                                sx={{ width: "100%", textAlign: "center" }}
                                onClick={handleUseLocation}
                              >
                                {lang("use-this-location")}
                              </Button>
                            )}
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
                    onClick={() => {
                      handleOpenInfo(0);
                    }}
                  >
                    {infoOpen === 0 && (
                      <InfoWindowF
                        position={home.coordinates}
                        onCloseClick={() => {
                          handleOpenInfo(0);
                        }}
                      >
                        <Box sx={{ width: 300, color: "black" }}>
                          <Typography>{home.name}</Typography>
                        </Box>
                      </InfoWindowF>
                    )}
                  </MarkerF>
                )}
              </GoogleMap>
            )}
          </Box>
          <Stack
            direction={"row"}
            position={"absolute"}
            zIndex={1000}
            bottom={10}
            gap={1}
            justifyContent={"center"}
            width={"100%"}
          >
            <Tooltip arrow title={"Go to prev"}>
              <IconButton
                onClick={gotoPrev}
                color="secondary"
                disabled={!fetchLocation.hasPrev}
              >
                <ArrowBackIosNewOutlined />
              </IconButton>
            </Tooltip>

            <Stack direction={"column"} gap={1} alignItems={"center"}>
              <Chip
                label={lang("locate-me")}
                sx={{
                  width: "fit-content",
                  px: 5,
                  fontWeight: 600,
                  fontSize: "1.3rem",
                  cursor: "pointer",
                }}
                color="secondary"
                onClick={handleLocateMe}
                icon={<CenterFocusStrongOutlined color="inherit" />}
              />
              <Chip
                label={lang("use-this-location")}
                sx={{
                  width: "fit-content",
                  px: 5,
                  fontWeight: 600,
                  fontSize: "1.3rem",
                  cursor: "pointer",
                }}
                disabled={isFetching}
                color="secondary"
                onClick={handleUseLocation}
              />
            </Stack>
            <Tooltip arrow title={"Go to next"}>
              <IconButton
                onClick={gotoNext}
                color="secondary"
                disabled={!fetchLocation.hasNext}
              >
                <ArrowForwardIosOutlined />
              </IconButton>
            </Tooltip>
          </Stack>
        </Stack>
      </Dialog>
    </Box>
  );
});
export default FoodMapPicker;
