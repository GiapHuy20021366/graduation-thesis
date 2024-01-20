import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { useEffect, useRef, useState } from "react";
import { ICoordinates, IUserInfo, mapIcons } from "../../../data";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowUpward,
  CenterFocusStrongOutlined,
  HomeMax,
  SocialDistance,
  Visibility,
} from "@mui/icons-material";
import {
  useAuthContext,
  useI18nContext,
  useLoading,
  usePageProgessContext,
} from "../../../hooks";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";
import ToggleChip from "../../common/custom/ToggleChip";
import { IGetUserNearParams, userFetcher } from "../../../api";
import InfoWindowUser from "./InfoWindowUser";

export default function UsersArroundPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [center, setCenter] = useState<ICoordinates>({
    lat: 21.02,
    lng: 105.83,
  });
  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [distance, setDistance] = useState<number>(0.5);
  const [maxVisible, setMaxVisible] = useState<number>(50);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const fetching = useLoading();
  const processContext = usePageProgessContext();
  const i8nContext = useI18nContext();
  const lang = i8nContext.of(UsersArroundPage);
  const mapRef = useRef<google.maps.Map>();
  const [loadUsersActive, setLoadUsersActive] = useState<boolean>(false);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const [selectedUser, setSelectedUser] = useState<number | string>();

  const setCurrentLocation = () => {
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
  };

  useEffect(() => {
    setCurrentLocation();
  }, []);

  const handleLocateMe = () => {
    setCenter({ ...center });
    setInfoOpen(true);
  };

  const handleOpenInfo = () => {
    setInfoOpen(!infoOpen);
  };

  const doLoadUsers = (params?: {
    maxDistance?: number;
    maxVisible?: number;
  }) => {
    // if (auth == null) return;
    const map = mapRef.current;
    if (map == null) return;

    const center = map.getCenter();
    if (center == null) return;

    if (fetching.isActice) return;

    const _maxDistance = params?.maxDistance ?? distance;
    const _maxVisible = params?.maxVisible ?? maxVisible;

    const paramsToSearch: IGetUserNearParams = {
      coordinate: {
        lat: center.lat(),
        lng: center.lng(),
      },
      maxDistance: _maxDistance,
      pagination: {
        skip: 0,
        limit: _maxVisible,
      },
    };

    fetching.active();
    processContext.start();
    setSelectedUser(undefined);

    userFetcher
      .getUsersNear(paramsToSearch, auth!)
      .then((data) => {
        const users = data.data ?? [];
        setUsers(users);
        setLoadUsersActive(false);
        console.log(users);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        fetching.deactive();
        processContext.end();
      });
  };

  const loadUserDefault = () => {
    doLoadUsers();
  };

  const onMapCenterChanged = () => {
    setLoadUsersActive(true);
  };

  const handleMaxDistanceChange = (value: number): void => {
    setDistance(value);
    doLoadUsers({ maxDistance: value });
  };

  const handleMaxVisibleChange = (value: number): void => {
    setMaxVisible(value);
    doLoadUsers({ maxVisible: value });
  };

  const onMapLoaded = (map: google.maps.Map) => {
    mapRef.current = map;
    setTimeout(() => {
      loadUserDefault();
    }, 500);
  };

  const toggleMarker = (index: number) => {
    if (selectedUser === index) setSelectedUser(undefined);
    else setSelectedUser(index);
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
            onCenterChanged={onMapCenterChanged}
          >
            <MarkerF
              icon={{
                url: mapIcons.home,
                scaledSize: new google.maps.Size(40, 40),
              }}
              position={center}
              onClick={handleOpenInfo}
            >
              {infoOpen && (
                <InfoWindowF position={center} onCloseClick={handleOpenInfo}>
                  <Box>
                    <span>Vị trí hiện tại của bạn</span>
                  </Box>
                </InfoWindowF>
              )}
            </MarkerF>
            {users.map((user, i) => {
              const coordinate = user.location?.coordinates;
              if (coordinate == null) return <></>;
              return (
                <MarkerF
                  key={i}
                  position={coordinate}
                  onClick={() => toggleMarker(i)}
                >
                  {selectedUser === i && (
                    <InfoWindowF
                      position={coordinate}
                      onCloseClick={() => toggleMarker(i)}
                    >
                      <InfoWindowUser user={user} />
                    </InfoWindowF>
                  )}
                </MarkerF>
              );
            })}
          </GoogleMap>
        )}
      </Box>
      <Box
        sx={{
          width: "100%",
          position: "absolute",
          bottom: 0,
        }}
      >
        <Stack direction={"column"} gap={1} alignItems={"center"} my={1}>
          <Chip
            label={"Locate Me"}
            sx={{
              backgroundColor: "purple",
              width: "fit-content",
              px: 5,
              fontWeight: 600,
              fontSize: "1.3rem",
              color: "white",
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
            label={"Load users at this area"}
            onClick={loadUserDefault}
            sx={{
              backgroundColor: "purple",
              width: "fit-content",
              px: 5,
              fontWeight: 600,
              fontSize: "1.3rem",
              color: "white",
              cursor: "pointer",
              ":hover": {
                backgroundColor: "white",
                color: "black",
              },
              display: fetching.isActice || !loadUsersActive ? "none" : "block",
            }}
          />
        </Stack>
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ArrowUpward />}>
            <Stack
              direction={"row"}
              width={"100%"}
              justifyContent={"space-around"}
              sx={{
                boxSizing: "border-box",
                boxShadow: 1,
              }}
            >
              <Chip
                icon={<SocialDistance />}
                label={distance + " km"}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "1.2rem",
                }}
              />
              <Chip
                icon={<Visibility />}
                label={users.length + " Humans"}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "1.2rem",
                }}
              />
              <Chip
                icon={<HomeMax />}
                label={maxVisible + " Humans"}
                sx={{
                  backgroundColor: "white",
                  color: "black",
                  fontSize: "1.2rem",
                }}
              />
            </Stack>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Box width={"100%"}>
              <Box sx={{ textAlign: "center" }}>Showing users in this area</Box>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {lang("Max distance")}:
                </Typography>
                <ToggleChipGroup
                  value={distance}
                  onValueChange={handleMaxDistanceChange}
                  exclusive
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                  }}
                >
                  <ToggleChip variant="outlined" label={"0.5 km"} value={0.5} />
                  <ToggleChip variant="outlined" label={"1 km"} value={1} />
                  <ToggleChip variant="outlined" label={"2 km"} value={2} />
                  <ToggleChip variant="outlined" label={"5 km"} value={5} />
                  <ToggleChip variant="outlined" label={"10 km"} value={10} />
                  <ToggleChip variant="outlined" label={"25 km"} value={25} />
                  <ToggleChip variant="outlined" label={"50 km"} value={50} />
                </ToggleChipGroup>
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600 }}>
                  {lang("Max visible")}:
                </Typography>
                <ToggleChipGroup
                  value={maxVisible}
                  onValueChange={handleMaxVisibleChange}
                  exclusive
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    gap: 1,
                  }}
                >
                  <ToggleChip variant="outlined" label={"25"} value={25} />
                  <ToggleChip variant="outlined" label={"50"} value={50} />
                  <ToggleChip variant="outlined" label={"100"} value={100} />
                  <ToggleChip variant="outlined" label={"200"} value={200} />
                  <ToggleChip variant="outlined" label={"500"} value={500} />
                </ToggleChipGroup>
              </Box>
            </Box>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}
