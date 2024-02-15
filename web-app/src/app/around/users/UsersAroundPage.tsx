import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { useEffect, useRef, useState } from "react";
import {
  ICoordinates,
  ILocation,
  IUserInfo,
  UserRole,
  mapIcons,
} from "../../../data";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Badge,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowUpward,
  CenterFocusStrongOutlined,
  LocalConvenienceStore,
  LocalGroceryStore,
  Person,
  Restaurant,
  SocialDistance,
  Storefront,
  VolunteerActivism,
} from "@mui/icons-material";
import {
  useAuthContext,
  useI18nContext,
  useLoading,
  usePageProgessContext,
} from "../../../hooks";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";
import ToggleChip from "../../common/custom/ToggleChip";
import { IGetUserNearParams, UserResponse, userFetcher } from "../../../api";
import InfoWindowUser from "./InfoWindowUser";
import TogglePurpleChip from "../../common/custom/TogglePurpleChip";

interface ISearchRoleParams {
  maxDistance?: number;
  maxVisible?: number;
}

export default function UsersAroundPage() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [center, setCenter] = useState<ICoordinates>({
    lat: 21.02,
    lng: 105.83,
  });

  const [users, setUsers] = useState<IUserInfo[]>([]);
  const [restaurants, setRestaurants] = useState<IUserInfo[]>([]); // revise later
  const [eateries, setEateries] = useState<IUserInfo[]>([]); // revise later
  const [groceries, setGroceries] = useState<IUserInfo[]>([]); // revise later
  const [markets, setMarkets] = useState<IUserInfo[]>([]); // revise later
  const [volunteers, setVolunteers] = useState<IUserInfo[]>([]); // revise later

  const [distance, setDistance] = useState<number>(0.5);
  // const [maxVisible, setMaxVisible] = useState<number>(50);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const fetching = useLoading();
  const processContext = usePageProgessContext();
  const i8nContext = useI18nContext();
  const lang = i8nContext.of(UsersAroundPage);
  const mapRef = useRef<google.maps.Map>();
  const [loadActive, setLoadActive] = useState<boolean>(false);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const [selectedMarker, setSelectedMarker] = useState<number | string>();
  const [home, setHome] = useState<ILocation>();
  const [roles, setRoles] = useState<UserRole[]>([UserRole.PERSONAL]);

  useEffect(() => {
    const userLocation = authContext.account?.location;
    if (userLocation != null && home == null) {
      setHome(userLocation);
    }
  }, [authContext.account, home]);

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

  const doLoadAll = (roles: UserRole[], params?: ISearchRoleParams) => {
    if (auth == null) return;
    const map = mapRef.current;
    if (map == null) return;

    const center = map.getCenter();
    if (center == null) return;

    if (fetching.isActice) return;

    const _maxDistance = params?.maxDistance ?? distance;
    const _maxVisible = params?.maxVisible ?? 50;

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

    const personalPromise: Promise<UserResponse<IUserInfo[]>> = roles.includes(
      UserRole.PERSONAL
    )
      ? userFetcher.getUsersNear(paramsToSearch, auth)
      : Promise.resolve({ data: users });

    const volunteerPromise: Promise<UserResponse<IUserInfo[]>> = roles.includes(
      UserRole.VOLUNTEER
    )
      ? userFetcher.getUsersNear(paramsToSearch, auth)
      : Promise.resolve({ data: volunteers });

    const restaurantsPromise: Promise<UserResponse<IUserInfo[]>> =
      roles.includes(UserRole.RESTAURANT)
        ? userFetcher.getUsersNear(paramsToSearch, auth)
        : Promise.resolve({ data: restaurants });

    const eateriesPromise: Promise<UserResponse<IUserInfo[]>> = roles.includes(
      UserRole.EATERY
    )
      ? userFetcher.getUsersNear(paramsToSearch, auth)
      : Promise.resolve({ data: eateries });

    const groceriesPromise: Promise<UserResponse<IUserInfo[]>> = roles.includes(
      UserRole.GROCERY
    )
      ? userFetcher.getUsersNear(paramsToSearch, auth)
      : Promise.resolve({ data: groceries });

    const marketsPromise: Promise<UserResponse<IUserInfo[]>> = roles.includes(
      UserRole.SUPERMARKET
    )
      ? userFetcher.getUsersNear(paramsToSearch, auth)
      : Promise.resolve({ data: markets });

    fetching.active();
    processContext.start();
    Promise.all([
      personalPromise,
      volunteerPromise,
      restaurantsPromise,
      eateriesPromise,
      groceriesPromise,
      marketsPromise,
    ])
      .then(
        ([
          personalRes,
          volunteerRes,
          restaurantRes,
          eateriesRes,
          groceryRes,
          marketRes,
        ]) => {
          const users = personalRes.data;
          if (users != null && users.length > 0) {
            setUsers(users);
          }

          const volunteers = volunteerRes.data;
          if (volunteers != null && volunteers.length > 0) {
            setVolunteers(volunteers);
          }

          const restaurants = restaurantRes.data;
          if (restaurants != null && restaurants.length > 0) {
            setRestaurants(restaurants);
          }

          const eateries = eateriesRes.data;
          if (eateries != null && eateries) {
            setEateries(eateries);
          }

          const groceries = groceryRes.data;
          if (groceries != null && groceries.length > 0) {
            setGroceries(groceries);
          }

          const markets = marketRes.data;
          if (markets != null && markets.length > 0) {
            setMarkets(markets);
          }

          setLoadActive(false);
        }
      )
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        fetching.deactive();
        processContext.end();
      });
  };

  const doLoadUsers = (params?: ISearchRoleParams) => {
    doLoadAll([UserRole.PERSONAL], params);
  };

  // const doLoadRestaurants = (params: ISearchRoleParams) => {
  //   console.log(params);
  // };

  const loadRolesDefault = () => {
    doLoadAll(roles);
  };

  const onMapCenterChanged = () => {
    setLoadActive(true);
  };

  const handleMaxDistanceChange = (value: number): void => {
    setDistance(value);
    doLoadUsers({ maxDistance: value });
  };

  const onMapLoaded = (map: google.maps.Map) => {
    mapRef.current = map;
    setTimeout(() => {
      loadRolesDefault();
    }, 500);
  };

  const toggleMarker = (index: number | string) => {
    if (selectedMarker === index) setSelectedMarker(undefined);
    else setSelectedMarker(index);
  };

  const handleChangeRoles = (newRoles: UserRole[]) => {
    const newSelectedRoles: UserRole[] = [];
    newRoles.forEach((role) => {
      if (!roles.includes(role)) newSelectedRoles.push(role);
    });
    doLoadAll(newSelectedRoles);
    setRoles(newRoles);
  };

  return (
    <Stack
      position={"relative"}
      direction={"column"}
      gap={1}
      width={"100%"}
      height={"100%"}
      boxSizing={"border-box"}
      padding={0}
    >
      <Box
        sx={{
          width: "fit-content",
          position: "absolute",
          top: 5,
          left: 1,
          zIndex: 1000,
          maxWidth: "90%",
        }}
      >
        <ToggleChipGroup
          value={roles}
          onValueChange={handleChangeRoles}
          sx={{
            display: "flex",
            flexDirection: "row",
            gap: 1,
            maxWidth: "100%",
            overflowY: "auto",
            "::-webkit-scrollbar": {
              display: "none",
            },
          }}
        >
          <TogglePurpleChip
            label={lang("People")}
            value={UserRole.PERSONAL}
            icon={<Person color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Restaurants")}
            value={UserRole.RESTAURANT}
            icon={<Restaurant color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Eateries")}
            value={UserRole.EATERY}
            icon={<Storefront color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Grocery")}
            value={UserRole.GROCERY}
            icon={<LocalConvenienceStore color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Markets")}
            value={UserRole.SUPERMARKET}
            icon={<LocalGroceryStore color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Volunteers")}
            value={UserRole.VOLUNTEER}
            icon={<VolunteerActivism color="inherit" />}
          />
        </ToggleChipGroup>
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
            onLoad={onMapLoaded}
            onCenterChanged={onMapCenterChanged}
          >
            <MarkerF
              icon={{
                url: mapIcons.homePin,
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

            {/* Personal */}
            {roles.includes(UserRole.PERSONAL) &&
              users.map((user, i) => {
                const coordinate = user.location?.coordinates;
                if (coordinate == null) return <></>;
                return (
                  <MarkerF
                    icon={{
                      url: mapIcons.userBlue,
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    key={i}
                    position={coordinate}
                    onClick={() => toggleMarker(user.id_)}
                  >
                    {selectedMarker === user.id_ && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(user.id_)}
                      >
                        <InfoWindowUser user={user} />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Restaurant */}
            {roles.includes(UserRole.RESTAURANT) &&
              restaurants.map((restaurant, i) => {
                const coordinate = restaurant.location?.coordinates;
                if (coordinate == null) return <></>;
                return (
                  <MarkerF
                    icon={{
                      url: mapIcons.restaurantBlack,
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    key={i}
                    position={coordinate}
                    onClick={() => toggleMarker(restaurant.id_)}
                  >
                    {selectedMarker === restaurant.id_ && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(restaurant.id_)}
                      >
                        <InfoWindowUser user={restaurant} />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Eateries */}
            {roles.includes(UserRole.EATERY) &&
              eateries.map((eatery, i) => {
                const coordinate = eatery.location?.coordinates;
                if (coordinate == null) return <></>;
                return (
                  <MarkerF
                    icon={{
                      url: mapIcons.restaurantColor,
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    key={i}
                    position={coordinate}
                    onClick={() => toggleMarker(eatery.id_)}
                  >
                    {selectedMarker === eatery.id_ && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(eatery.id_)}
                      >
                        <InfoWindowUser user={eatery} />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Grocery */}
            {roles.includes(UserRole.GROCERY) &&
              groceries.map((grocery, i) => {
                const coordinate = grocery.location?.coordinates;
                if (coordinate == null) return <></>;
                return (
                  <MarkerF
                    icon={{
                      url: mapIcons.groceryBlack,
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    key={i}
                    position={coordinate}
                    onClick={() => toggleMarker(grocery.id_)}
                  >
                    {selectedMarker === grocery.id_ && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(grocery.id_)}
                      >
                        <InfoWindowUser user={grocery} />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Market */}
            {roles.includes(UserRole.SUPERMARKET) &&
              markets.map((market, i) => {
                const coordinate = market.location?.coordinates;
                if (coordinate == null) return <></>;
                return (
                  <MarkerF
                    icon={{
                      url: mapIcons.marketBuyBlack,
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    key={i}
                    position={coordinate}
                    onClick={() => toggleMarker(market.id_)}
                  >
                    {selectedMarker === market.id_ && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(market.id_)}
                      >
                        <InfoWindowUser user={market} />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Volunteer */}
            {roles.includes(UserRole.VOLUNTEER) &&
              volunteers.map((volunteer, i) => {
                const coordinate = volunteer.location?.coordinates;
                if (coordinate == null) return <></>;
                return (
                  <MarkerF
                    icon={{
                      url: mapIcons.volunteerHandBlack,
                      scaledSize: new google.maps.Size(30, 30),
                    }}
                    key={i}
                    position={coordinate}
                    onClick={() => toggleMarker(volunteer.id_)}
                  >
                    {selectedMarker === volunteer.id_ && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(volunteer.id_)}
                      >
                        <InfoWindowUser user={volunteer} />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {home != null && (
              <MarkerF
                icon={{
                  url: mapIcons.homeGreen,
                  scaledSize: new google.maps.Size(40, 40),
                }}
                position={home.coordinates}
              >
                <InfoWindowF position={home.coordinates}>
                  <Box sx={{ width: 200 }}>
                    <span>Nhà của bạn</span>
                  </Box>
                </InfoWindowF>
              </MarkerF>
            )}
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
            label={"Load this area"}
            onClick={loadRolesDefault}
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
              display: fetching.isActice || !loadActive ? "none" : "block",
            }}
          />
        </Stack>
        <Accordion>
          <AccordionSummary expandIcon={<ArrowUpward />}>
            <Stack
              direction={"row"}
              width={"100%"}
              sx={{
                boxSizing: "border-box",
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
              <Stack direction={"row"} gap={2} marginLeft={"auto"} mr={2}>
                {roles.includes(UserRole.PERSONAL) && (
                  <Badge badgeContent={users.length} color="info">
                    <Person />
                  </Badge>
                )}
                {roles.includes(UserRole.RESTAURANT) && (
                  <Badge badgeContent={restaurants.length} color="info">
                    <Restaurant />
                  </Badge>
                )}
                {roles.includes(UserRole.EATERY) && (
                  <Badge badgeContent={eateries.length} color="info">
                    <Storefront />
                  </Badge>
                )}
                {roles.includes(UserRole.GROCERY) && (
                  <Badge badgeContent={groceries.length} color="info">
                    <LocalConvenienceStore />
                  </Badge>
                )}
                {roles.includes(UserRole.SUPERMARKET) && (
                  <Badge badgeContent={markets.length} color="info">
                    <LocalGroceryStore />
                  </Badge>
                )}
                {roles.includes(UserRole.VOLUNTEER) && (
                  <Badge badgeContent={volunteers.length} color="info">
                    <VolunteerActivism />
                  </Badge>
                )}
              </Stack>
            </Stack>
          </AccordionSummary>
          <Divider />
          <AccordionDetails>
            <Stack width={"100%"} gap={1}>
              <Box sx={{ textAlign: "center" }}>
                {lang("Showing in this area")}
              </Box>
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
            </Stack>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Stack>
  );
}
