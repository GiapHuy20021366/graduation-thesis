import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  Divider,
  ImageListItem,
  Stack,
} from "@mui/material";
import { ICoordinates } from "../../../data";
import { memo, useCallback, useEffect, useState } from "react";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { GoogleMap, Marker, useJsApiLoader } from "@react-google-maps/api";
import axios from "axios";

interface IFoodMapPicker {
  onPicked?: (location: ICoordinates) => void;
}

const FoodMapPicker = memo(({ onPicked }: IFoodMapPicker) => {
  const [open, setOpen] = useState<boolean>(false);
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [locationName, setLocationName] = useState<string>("My location");

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<ICoordinates>({
    lat: -3.745,
    lng: -38.523,
  });
  const [choosed, setChoosed] = useState<ICoordinates>({
    lat: -3.745,
    lng: -38.523,
  });

  const handleMapClick = (event: google.maps.MapMouseEvent) => {
    const { latLng } = event;
    if (latLng != null) {
      const lat = latLng.lat();
      const lng = latLng.lng();
      setChoosed({ lat, lng });
      onPicked && onPicked({ lat, lng });
      try {
        setLocationName("Loading...");
        axios
          .get(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${choosed.lat},${choosed.lng}&key=${GOOGLE_MAP_API_KEY}`
          )
          .then((response) => {
            const locationName = response.data.results[0]?.formatted_address;
            if (locationName != null) {
              setLocationName(locationName);
            } else {
              setLocationName("Cannot find the location name");
            }
          });
      } catch (error) {
        console.error("Error fetching location information:", error);
      }
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
          setChoosed(pos);
          console.log("center", pos);
        },
        (error: GeolocationPositionError) => {
          console.log(error);
        }
      );
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    const bounds = new window.google.maps.LatLngBounds(center);
    map.fitBounds(bounds);
    setMap(map);
  }, []);

  const onUnmount = useCallback((): void => {
    setMap(null);
  }, []);
  return (
    <Box>
      <Stack direction={"row"}>
        <Box sx={{padding: "8px 0"}}>{locationName}</Box>
        <Button
          sx={{
            marginLeft: "auto",
          }}
          onClick={() => setOpen(true)}
        >
          <u>Picker</u>
        </Button>
      </Stack>

      <img
        src={`/imgs/map-sample.png`}
        alt={"img"}
        loading="lazy"
        style={{
            width: "100%",
            height: "auto",
        }}
      />
      <Dialog open={open} fullScreen>
        <Stack direction={"row"}>
          <DialogTitle>Map Picker</DialogTitle>
          <Button sx={{ marginLeft: "auto" }} onClick={() => setOpen(false)}>
            Close
          </Button>
        </Stack>
        <Divider />
        <Box component="h4">{locationName}</Box>
        {isLoaded && (
          <GoogleMap
            center={center}
            zoom={15}
            onLoad={onLoad}
            onUnmount={onUnmount}
            mapContainerClassName={"google-map-container"}
            onClick={handleMapClick}
          >
            <Marker position={choosed} />
          </GoogleMap>
        )}
      </Dialog>
    </Box>
  );
});
export default FoodMapPicker;
