import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Stack,
} from "@mui/material";
import { GeoCodeMapsData, ICoordinates } from "../../../data";
import { memo, useCallback, useEffect, useRef, useState } from "react";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import { KeyboardArrowRight } from "@mui/icons-material";
import { geocodeMapFindAddess } from "../../../api";
import { useFoodSharingFormContext } from "../../../contexts";

const FoodMapPicker = memo(() => {
  const [open, setOpen] = useState<boolean>(false);
  const formContext = useFoodSharingFormContext();
  const { location, setLocation } =
    formContext;
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  const [fetching, setFetching] = useState<boolean>(false);

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const timeout = useRef<number | null>(null);
  const [lastFetchedPos, setLastFetchedPos] = useState<ICoordinates | null>(null);

  const fetchAddress = useCallback((pos: ICoordinates) => {
    const timeOutId = timeout.current;
    if (timeOutId != null) {
      clearTimeout(timeOutId);
      timeout.current = null;
    }
    timeout.current = setTimeout(() => {
      try {
        setFetching(true);
        geocodeMapFindAddess(pos).then((data: GeoCodeMapsData | null) => {
          if (data != null) {
            const address = data.displayName;
            setLocation({
              name: address,
              coordinates: pos,
            });
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
  }, [setLocation]);

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const { latLng } = event;
    if (latLng != null) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      const clickedPos = {lat, lng}
      fetchAddress(clickedPos);
    }
  };

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds();
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback((): void => {
    setMap(null);
  }, []);

  useEffect(() => {
    const cur = location.coordinates;
    const last = lastFetchedPos;
    let needFetch: boolean = false;
    needFetch ||= last == null;
    if (last != null) {
      needFetch ||= last.lat !== cur.lat;
      needFetch ||= last.lng !== cur.lng;
    }
    needFetch && fetchAddress(cur);
  }, [location.coordinates, lastFetchedPos, fetchAddress]);

  useEffect(() => {
    if (open) {
      if (map != null) {
        setTimeout(() => {
          map.setCenter(location.coordinates);
          map.setZoom(15);
        }, 0);
      }
    }
  }, [open, map, location.coordinates])


  return (
    <Box>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
        }}
      >
        <h4>Location</h4>
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
          {fetching ? "Loading..." : location.name}
        </Box>
      </Stack>
      <Dialog open={open} fullScreen>
        <Stack direction={"row"}>
          <DialogTitle>Map Picker</DialogTitle>
          <Button sx={{ marginLeft: "auto" }} onClick={() => setOpen(false)}>
            Close
          </Button>
        </Stack>
        <Divider />
        <Box component="h4">{fetching ? "Loading..." : location.name}</Box>
        {isLoaded && (
          <GoogleMap
            center={location.coordinates}
            zoom={16}
            onLoad={onLoad}
            onUnmount={onUnmount}
            mapContainerClassName={"google-map-container"}
            onClick={handleMapClick}
          >
            <Marker position={location.coordinates} />
          </GoogleMap>
        )}
      </Dialog>
    </Box>
  );
});
export default FoodMapPicker;
