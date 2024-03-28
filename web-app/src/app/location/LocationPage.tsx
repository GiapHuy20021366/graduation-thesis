import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "../../env";
import { useCallback, useEffect, useState } from "react";
import { ICoordinates, ILocation, RequestStatus, mapIcons } from "../../data";
import {
  Box,
  Button,
  Chip,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  ArrowBackIosNewOutlined,
  ArrowForwardIosOutlined,
  CenterFocusStrongOutlined,
} from "@mui/icons-material";
import { userFetcher } from "../../api";
import {
  useAuthContext,
  useComponentLanguage,
  useDistanceCalculation,
  useFetchLocation,
  useToastContext,
} from "../../hooks";

const isDiffLocation = (pos1: ICoordinates, pos2?: ICoordinates): boolean => {
  if (pos2 == null) return true;
  return pos1.lat !== pos2.lat || pos1.lng !== pos2.lng;
};

export default function LocationPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  const authContext = useAuthContext();
  const { auth, account } = authContext;

  const [center, setCenter] = useState<ICoordinates>(
    account?.location?.coordinates ?? {
      lat: 21.02,
      lng: 105.83,
    }
  );
  const location = useFetchLocation({
    defaultLocation: account?.location,
  });

  const [home, setHome] = useState<ILocation>();
  const toastContext = useToastContext();

  const lang = useComponentLanguage();

  const [infoOpen, setInfoOpen] = useState<number | undefined>(0);

  const distances = useDistanceCalculation();

  const fetchAddress = useCallback(
    (pos: ICoordinates) => {
      const fetcheds = location.fetcheds;
      const index = fetcheds.findIndex(
        (f) => f.coordinates.lat === pos.lat && f.coordinates.lng === pos.lng
      );
      if (index !== -1) {
        location.setLocation(fetcheds[index]);
      } else {
        location.fetch(pos, {
          onSuccess: (fLocation: ILocation) => {
            location.setLocation(fLocation);
          },
        });
      }
    },
    [location]
  );

  const setCurrentLocation = () => {
    const current = distances.currentLocation;
    if (current) {
      setCenter(current.coordinates);
      setInfoOpen(1);
      fetchAddress(current.coordinates);
    }
  };

  useEffect(() => {
    setCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const handleSetMyLocation = () => {
    if (auth == null) return;
    const newLocation = location.location;
    if (newLocation == null) return;

    userFetcher
      .setLocation(authContext.account!._id, newLocation, auth)
      .then(() => {
        setHome(newLocation);
        setInfoOpen(0);
        authContext.updateLocation(newLocation);
        toastContext.success("Set location successful");
      })
      .catch(() => {
        toastContext.error("Can not set location now");
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

      fetchAddress({ lat, lng });
      setInfoOpen(1);
    }
  };

  const gotoPrev = () => {
    const fetcheds = location.fetcheds;
    const current = location.location;
    if (current != null) {
      const index = fetcheds.indexOf(current);
      if (index !== -1 && index > 0) {
        const nLocation = fetcheds[index - 1];
        location.setLocation(nLocation);
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
    const fetcheds = location.fetcheds;
    const current = location.location;
    if (current != null) {
      const index = fetcheds.indexOf(current);
      if (index <= 0 && index < fetcheds.length - 1) {
        const nLocation = fetcheds[index + 1];
        location.setLocation(nLocation);
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

  const locationName = location.location?.name ?? "Vị trí hiện tại của tôi";
  const selectedLocation = location.location;
  const selectedCoordinates = selectedLocation?.coordinates;
  const isFetching = location.status === RequestStatus.INCHING;

  return (
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
                          {isFetching ? "Loading..." : locationName}
                        </Typography>
                        <Button
                          sx={{ width: "100%", textAlign: "center" }}
                          onClick={handleSetMyLocation}
                        >
                          Đặt vị trí của tôi
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
            disabled={!location.hasPrev}
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
            label={lang("set-my-location")}
            sx={{
              width: "fit-content",
              px: 5,
              fontWeight: 600,
              fontSize: "1.3rem",
              cursor: "pointer",
            }}
            disabled={isFetching}
            color="secondary"
            onClick={handleSetMyLocation}
          />
        </Stack>
        <Tooltip arrow title={"Go to next"}>
          <IconButton
            onClick={gotoNext}
            color="secondary"
            disabled={!location.hasNext}
          >
            <ArrowForwardIosOutlined />
          </IconButton>
        </Tooltip>
      </Stack>
    </Stack>
  );
}
