import { memo, useCallback, useEffect, useState } from "react";
import { GOOGLE_MAP_API_KEY } from "../../env";
import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  InfoBox,
} from "@react-google-maps/api";
import { ICoordinates } from "../../data";

interface ISimpleMapProps {
  containerClassName: string;
}

export const SimpleMap = memo(({ containerClassName }: ISimpleMapProps) => {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [center, setCenter] = useState<ICoordinates>({
    lat: -3.745,
    lng: -38.523,
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: GeolocationPosition) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCenter(pos);
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

  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = () => {
    console.log("hhh");
    setOpen(!open);
  };

  return isLoaded ? (
    <GoogleMap
      center={center}
      zoom={15}
      onLoad={onLoad}
      onUnmount={onUnmount}
      mapContainerClassName={containerClassName}
    >
      <Marker
        // icon={{
        //   url: mapIcons.home,
        //   scaledSize: new google.maps.Size(40, 40),
        // }}
        position={center}
        onClick={handleToggle}
      >
        {open && (
          <InfoBox
              options={{
                // closeBoxURL: "",
                enableEventPropagation: true,
                visible: true
              }}
            onCloseClick={handleToggle}

          >
            <span>Helloo</span>
          </InfoBox>
        )}
      </Marker>
    </GoogleMap>
  ) : (
    <></>
  );
});
