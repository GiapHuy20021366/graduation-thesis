import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Box, Chip, Stack, StackProps } from "@mui/material";
import {
  GoogleMap,
  InfoWindowF,
  MarkerF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { CenterFocusStrongOutlined } from "@mui/icons-material";
import { ICoordinates, ILocation, mapIcons } from "../../../data";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { useComponentLanguage } from "../../../hooks";

type LocationExposedProps = StackProps & {
  targetLocation?: ILocation;
  homeLocation?: ILocation;
  currentLocation?: ILocation;
  infoContent?: ReactNode;
  iconTargetUrl?: string;
};

const LocationExposed = React.forwardRef<HTMLDivElement, LocationExposedProps>(
  (props, ref) => {
    const {
      targetLocation,
      currentLocation,
      infoContent,
      homeLocation,
      iconTargetUrl,
      ...rest
    } = props;

    const { isLoaded } = useJsApiLoader({
      id: "google-map-script",
      googleMapsApiKey: GOOGLE_MAP_API_KEY,
    });
    const [center, setCenter] = useState<ICoordinates | undefined>(
      targetLocation?.coordinates
    );

    const lang = useComponentLanguage("LocationExposed");

    const mapRef = useRef<google.maps.Map>();

    const onMapLoaded = (map: google.maps.Map) => {
      mapRef.current = map;
    };

    useEffect(() => {
      const map = mapRef.current;
      if (map == null) return;
      if (targetLocation != null && center == null) {
        setTimeout(() => {
          setCenter(targetLocation.coordinates);
          map.setCenter(targetLocation.coordinates);
        }, 500);
      }
    }, [center, targetLocation]);

    const handleLocateMe = () => {
      if (currentLocation != null) {
        setCenter(currentLocation.coordinates);
      }
    };

    const handleLocateMyHome = () => {
      if (homeLocation != null) {
        setCenter(homeLocation.coordinates);
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
              onLoad={onMapLoaded}
            >
              {homeLocation != null && (
                <MarkerF
                  icon={{
                    url: mapIcons.homeGreen,
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                  position={homeLocation.coordinates}
                >
                  <InfoWindowF position={homeLocation.coordinates}>
                    <Box>{lang("your-home")}</Box>
                  </InfoWindowF>
                </MarkerF>
              )}
              {currentLocation != null && (
                <MarkerF
                  icon={{
                    url: mapIcons.homePin,
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                  position={currentLocation.coordinates}
                >
                  <InfoWindowF position={currentLocation.coordinates}>
                    <Box>{lang("your-current-location")}</Box>
                  </InfoWindowF>
                </MarkerF>
              )}
              {targetLocation != null && (
                <MarkerF
                  icon={{
                    url: iconTargetUrl ?? mapIcons.homePin,
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                  position={targetLocation.coordinates}
                >
                  <InfoWindowF position={targetLocation.coordinates}>
                    {infoContent ? (
                      infoContent
                    ) : (
                      <Box>{lang("target-current-location")}</Box>
                    )}
                  </InfoWindowF>
                </MarkerF>
              )}
            </GoogleMap>
          )}
        </Box>
        <Chip
          label={lang("your-current-location")}
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
          label={lang("your-home-location")}
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
          onClick={handleLocateMyHome}
        />
      </Stack>
    );
  }
);

export default LocationExposed;
