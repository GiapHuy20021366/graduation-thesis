import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { userFetcher } from "../../../api";
import {
  useAuthContext,
  useDistanceCalculation,
  useFetchLocation,
  useLoader,
  useToastContext,
  useUserViewerContext,
} from "../../../hooks";
import { ICoordinates, ILocation, mapIcons } from "../../../data";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import {
  useJsApiLoader,
  GoogleMap,
  MarkerF,
  InfoWindowF,
} from "@react-google-maps/api";
import { CenterFocusStrongOutlined } from "@mui/icons-material";

type UserViewerLocationEditorProps = DialogProps & {
  onCancel?: () => void;
  onSuccess?: (location?: ILocation) => void;
};

const UserViewerLocationEditor = React.forwardRef<
  HTMLDivElement,
  UserViewerLocationEditorProps
>((props, ref) => {
  const { onCancel, onSuccess, ...rest } = props;
  const authContext = useAuthContext();
  const { auth } = authContext;
  const loader = useLoader();
  const viewerContext = useUserViewerContext();
  const {
    _id,
    location: viewerLocation,
    setLocation: setViewerLocation,
  } = viewerContext;
  const toast = useToastContext();
  const distances = useDistanceCalculation();
  const fetchLocation = useFetchLocation({});
  const [selected, setSelected] = useState<ICoordinates | undefined>(
    viewerLocation?.coordinates
  );

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [center, setCenter] = useState<ICoordinates>({
    lat: 21.02,
    lng: 105.83,
  });
  const mapRef = useRef<google.maps.Map>();

  const dirtyRef = useRef<boolean>(false);

  useEffect(() => {
    if (props.open) {
      if (dirtyRef.current === true) {
        return;
      } else {
        fetchLocation.setLocation(viewerLocation);
        const map = mapRef.current;
        if (map) {
          setTimeout(() => {
            setCenter(
              viewerLocation?.coordinates ??
                distances.currentLocation?.coordinates ?? {
                  lat: 21.02,
                  lng: 105.83,
                }
            );
            dirtyRef.current = true;
          }, 0);
        }
      }
    } else {
      dirtyRef.current = false;
    }
  }, [distances.currentLocation, fetchLocation, props.open, viewerLocation]);

  const handleOnClickOk = () => {
    const location = fetchLocation.location;
    if (JSON.stringify(location) === JSON.stringify(viewerLocation)) {
      onSuccess && onSuccess(location);
      return;
    }
    if (auth == null) return;

    loader.setIsError(false);
    loader.setIsFetching(true);

    userFetcher
      .updatePersonalData(
        _id,
        {
          updated: {
            location: location ? location : undefined,
          },
          deleted: {
            location: location ? undefined : true,
          },
        },
        auth
      )
      .then(() => {
        onSuccess && onSuccess(location);
        setViewerLocation(location);
      })
      .catch(() => {
        loader.setIsError(true);
        toast.error("Không thể thực hiện hành động bây giờ");
      })
      .finally(() => {
        loader.setIsFetching(false);
      });
  };

  const handleOnClickCancel = () => {
    onCancel && onCancel();
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

  const handleLocateMe = () => {
    const current = distances.currentLocation?.coordinates;
    if (current == null) return;

    fetchLocation.fetch(current, {
      onSuccess: () => {
        setSelected(current);
        setCenter(current);
      },
    });
  };

  return (
    <Dialog
      ref={ref}
      {...rest}
      sx={{
        ...rest.sx,
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            minWidth: ["100svw", "80svw"],
            maxWidth: ["100svw", "80svw"],
            maxHeight: ["100svh", "80svh"],
            minHeight: ["100svh", "80svh"],
          },
        },
      }}
    >
      <DialogTitle>Chỉnh sửa</DialogTitle>
      <DialogContent sx={{ p: 0, m: 0, width: "100%", height: "100%" }}>
        {isLoaded && (
          <Box
            position={"relative"}
            height={"80svh"}
            width={"1005"}
            boxSizing={"border-box"}
          >
            <GoogleMap
              center={center}
              zoom={16}
              mapContainerStyle={{
                width: "100%",
                height: "100%",
                boxSizing: "border-box",
              }}
              onClick={handleMapClick}
              onLoad={(map: google.maps.Map) => {
                mapRef.current = map;
              }}
            >
              {selected && (
                <MarkerF
                  icon={{
                    url: mapIcons.homePin,
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                  position={selected}
                >
                  <InfoWindowF position={selected}>
                    <Box sx={{ width: 200, zIndex: 1000 }}>
                      <span>Vị trí đã chọn</span>
                      <Typography>
                        {fetchLocation.location?.name ?? "Vị trí không biết"}
                      </Typography>
                    </Box>
                  </InfoWindowF>
                </MarkerF>
              )}
              {viewerLocation != null && (
                <MarkerF
                  icon={{
                    url: mapIcons.homeGreen,
                    scaledSize: new google.maps.Size(40, 40),
                  }}
                  position={viewerLocation.coordinates}
                >
                  <InfoWindowF position={viewerLocation.coordinates}>
                    <Box sx={{ width: 200, zIndex: 1000 }}>
                      <span>Nhà của bạn</span>
                      <Typography>
                        {viewerLocation?.name ?? "Vị trí không biết"}
                      </Typography>
                    </Box>
                  </InfoWindowF>
                </MarkerF>
              )}
            </GoogleMap>

            <Chip
              label={"Locate Me"}
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
              onClick={handleLocateMe}
              icon={<CenterFocusStrongOutlined color="inherit" />}
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button
          color="primary"
          variant="contained"
          onClick={handleOnClickCancel}
          disabled={loader.isFetching}
        >
          Hủy bỏ
        </Button>
        <Button
          color="success"
          variant="contained"
          onClick={handleOnClickOk}
          disabled={loader.isFetching}
        >
          Đồng ý
        </Button>
      </DialogActions>
    </Dialog>
  );
});

export default UserViewerLocationEditor;
