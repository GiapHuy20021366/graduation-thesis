import React, { ReactNode, useEffect, useState } from "react";
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

    useEffect(() => {
      if (targetLocation != null && center == null) {
        setCenter(targetLocation.coordinates);
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
                    <Box>Nhà của bạn</Box>
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
                    <Box>Vị trí hiện tại của bạn</Box>
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
                      <Box>"Vị trí của mục tiêu"</Box>
                    )}
                  </InfoWindowF>
                </MarkerF>
              )}
            </GoogleMap>
          )}
        </Box>
        <Chip
          label={"Vị trí hiện tại của tôi"}
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
          label={"Vị trí nhà của tôi"}
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
