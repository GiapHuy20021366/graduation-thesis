import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "../../env";
import { useCallback, useEffect, useRef, useState } from "react";
import { GeoCodeMapsData, ICoordinates, mapIcons } from "../../data";
import { Box, Button, Chip, Stack, TextField } from "@mui/material";
import { CenterFocusStrongOutlined } from "@mui/icons-material";
import { geocodeMapFindAddess } from "../../api";

export default function LocationPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [center, setCenter] = useState<ICoordinates>({
    lat: 21.02,
    lng: 105.83,
  });
  const [selected, setSelected] = useState<ICoordinates>();
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const [locationName, setLocationName] = useState<string>(
    "My current location"
  );
  const [fetching, setFetching] = useState<boolean>(false);
  const [lastFetchedPos, setLastFetchedPos] = useState<ICoordinates>();
  const timeout = useRef<number>();

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
    setCurrentLocation();
  }, []);

  const handleLocateMe = () => {
    setCenter({ ...center });
    setSelected({ ...center });
    setInfoOpen(true);
  };

  const handleOpenInfo = () => {
    setInfoOpen(!infoOpen);
  };

  const handleSetMyLocation = () => {
    console.log("Location");
  };

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
      position={"relative"}
      direction={"column"}
      gap={1}
      width={"100%"}
      height={["80vh", "90vh", "90vh", "95vh"]}
      maxHeight={"100%"}
      boxSizing={"border-box"}
      padding={0}
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
            {selected && (
              <MarkerF
                icon={{
                  url: mapIcons.home,
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
                      <span>Cho mọi người biết vị trí của bạn</span>
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
        label={"Set My Location"}
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
}
