import {
  GoogleMap,
  MarkerF,
  InfoWindowF,
  useJsApiLoader,
} from "@react-google-maps/api";
import { GOOGLE_MAP_API_KEY } from "../../../env";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ICoordinates,
  ILocation,
  IPlaceExposed,
  IUserInfo,
  IUserSearchParams,
  OrderState,
  PlaceType,
  loadFromSessionStorage,
  mapIcons,
  saveToSessionStorage,
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
  useDistanceCalculation,
  useI18nContext,
  useLoader,
} from "../../../hooks";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";
import ToggleChip from "../../common/custom/ToggleChip";
import { IPlaceSearchParams, userFetcher } from "../../../api";
import InfoWindowUser from "./InfoWindowUser";
import TogglePurpleChip from "../../common/custom/TogglePurpleChip";
import InfoWindowPlace from "./InfoWindowPlace";

interface IUserAroundPageSnapshotData {
  center: ICoordinates;
  users: IUserInfo[];
  restaurants: IPlaceExposed[];
  eateries: IPlaceExposed[];
  groceries: IPlaceExposed[];
  markets: IPlaceExposed[];
  volunteers: IPlaceExposed[];
  distance: number;
  roles: PlaceType[];
  selectedMarker?: number | string;
}

const USER_AROUND_PAGE_STORAGE_KEY = "food.around.page";

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
  const [restaurants, setRestaurants] = useState<IPlaceExposed[]>([]);
  const [eateries, setEateries] = useState<IPlaceExposed[]>([]);
  const [groceries, setGroceries] = useState<IPlaceExposed[]>([]);
  const [markets, setMarkets] = useState<IPlaceExposed[]>([]);
  const [volunteers, setVolunteers] = useState<IPlaceExposed[]>([]);

  const [distance, setDistance] = useState<number>(0.5);
  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const i8nContext = useI18nContext();
  const lang = i8nContext.of(UsersAroundPage);
  const mapRef = useRef<google.maps.Map>();
  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const [selectedMarker, setSelectedMarker] = useState<number | string>();
  const [home, setHome] = useState<ILocation>();
  const [roles, setRoles] = useState<PlaceType[]>([PlaceType.PERSONAL]);
  const [loadActive, setLoadActive] = useState<boolean>(false);
  const distances = useDistanceCalculation();

  const loader = useLoader();
  const dirtyRef = useRef<boolean>(true);

  const doSaveStorage = () => {
    const map = mapRef.current;
    if (map == null) return;
    const center = map.getCenter();
    if (center == null) return;

    const current: ICoordinates = {
      lat: center.lat(),
      lng: center.lng(),
    };

    const snapshot: IUserAroundPageSnapshotData = {
      center: current,
      distance,
      eateries,
      groceries,
      markets,
      restaurants,
      roles,
      users,
      volunteers,
      selectedMarker,
    };
    saveToSessionStorage(snapshot, {
      key: USER_AROUND_PAGE_STORAGE_KEY,
    });
  };

  const setCurrentLocation = useCallback(() => {
    () => {
      const current = distances.currentLocation?.coordinates;
      if (current) {
        setCenter(current);
      }
    };
  }, [distances.currentLocation]);

  useEffect(() => {
    const userLocation = authContext.account?.location;
    if (userLocation != null && home == null) {
      setHome(userLocation);
    }
  }, [authContext.account, home]);

  const handleLocateMe = () => {
    setCenter({ ...center });
    setInfoOpen(true);
  };

  const handleOpenInfo = () => {
    setInfoOpen(!infoOpen);
  };

  const doLoadUsers = useCallback(
    (maxDistance: number) => {
      if (loader.isFetching) return;
      if (account == null || auth == null) return;

      const map = mapRef.current;
      if (map == null) return;

      const center = map.getCenter();
      if (center == null) return;

      const current: ICoordinates = {
        lat: center.lat(),
        lng: center.lng(),
      };

      const params: IUserSearchParams = {
        distance: {
          max: maxDistance,
          current: current,
        },
        order: {
          distance: OrderState.INCREASE,
        },
        pagination: {
          skip: 0,
          limit: 50,
        },
      };

      loader.setIsFetching(true);
      loader.setIsError(true);
      loader.setIsEnd(false);

      userFetcher
        .searchUser(params, auth)
        .then((res) => {
          const data = res.data;
          if (data) {
            const datas = data.filter((d) => d.id_ !== account.id_);
            setUsers(datas);
            if (datas.length < 50) {
              loader.setIsEnd(true);
            }
          }
        })
        .catch(() => {
          loader.setIsError(true);
        })
        .finally(() => {
          loader.setIsFetching(false);
        });
    },
    [account, auth, loader]
  );

  const doLoadPlaces = useCallback(
    (type: PlaceType, maxDistance: number): Promise<IPlaceExposed[]> => {
      if (auth == null) return Promise.resolve([]);

      const map = mapRef.current;
      if (map == null) return Promise.resolve([]);

      const center = map.getCenter();
      if (center == null) return Promise.resolve([]);

      const current: ICoordinates = {
        lat: center.lat(),
        lng: center.lng(),
      };

      const params: IPlaceSearchParams = {
        maxDistance: maxDistance,
        currentLocation: current,
        pagination: {
          skip: 0,
          limit: 50,
        },
        types: [type],
      };

      return userFetcher.searchPlace(params, auth).then((res) => {
        const data = res.data;
        if (data) return data;
        else return [];
      });
    },
    [auth]
  );

  const doLoadRestaurants = useCallback(
    (maxDistance: number) => {
      doLoadPlaces(PlaceType.RESTAURANT, maxDistance).then((restaurants) => {
        setRestaurants(restaurants);
      });
    },
    [doLoadPlaces]
  );

  const doLoadVolunteers = useCallback(
    (maxDistance: number) => {
      doLoadPlaces(PlaceType.VOLUNTEER, maxDistance).then((volunteers) => {
        setVolunteers(volunteers);
      });
    },
    [doLoadPlaces]
  );

  const doLoadEateries = useCallback(
    (maxDistance: number) => {
      doLoadPlaces(PlaceType.EATERY, maxDistance).then((eateries) => {
        setEateries(eateries);
      });
    },
    [doLoadPlaces]
  );

  const doLoadMarkets = useCallback(
    (maxDistance: number) => {
      doLoadPlaces(PlaceType.SUPERMARKET, maxDistance).then((markets) => {
        setMarkets(markets);
      });
    },
    [doLoadPlaces]
  );

  const doLoadGroceries = useCallback(
    (maxDistance: number) => {
      doLoadPlaces(PlaceType.GROCERY, maxDistance).then((groceries) => {
        setGroceries(groceries);
      });
    },
    [doLoadPlaces]
  );

  const doLoadAll = useCallback(
    (types: PlaceType[], maxDistance: number) => {
      for (let i = 0; i < types.length; ++i) {
        const type = types[i];
        switch (type) {
          case PlaceType.PERSONAL:
            doLoadUsers(maxDistance);
            break;
          case PlaceType.EATERY:
            doLoadEateries(maxDistance);
            break;
          case PlaceType.GROCERY:
            doLoadGroceries(maxDistance);
            break;
          case PlaceType.RESTAURANT:
            doLoadRestaurants(maxDistance);
            break;
          case PlaceType.SUPERMARKET:
            doLoadMarkets(maxDistance);
            break;
          case PlaceType.VOLUNTEER:
            doLoadVolunteers(maxDistance);
            break;
        }
      }
    },
    [
      doLoadEateries,
      doLoadGroceries,
      doLoadMarkets,
      doLoadRestaurants,
      doLoadUsers,
      doLoadVolunteers,
    ]
  );

  const doLoadArea = useCallback(() => {
    setLoadActive(false);
    doLoadAll(roles, distance);
  }, [distance, doLoadAll, roles]);

  const onMapCenterChanged = () => {
    setLoadActive(true);
  };

  const handleMaxDistanceChange = (value: number): void => {
    setDistance(value);
    doLoadAll(roles, value);
  };

  const onMapLoaded = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const toggleMarker = (index: number | string) => {
    if (selectedMarker === index) setSelectedMarker(undefined);
    else setSelectedMarker(index);
  };

  const handleChangeRoles = (newRoles: PlaceType[]) => {
    setRoles(newRoles);
    const newSelectedRoles: PlaceType[] = [];
    newRoles.forEach((role) => {
      if (!roles.includes(role)) newSelectedRoles.push(role);
    });
    doLoadAll(newSelectedRoles, distance);
  };

  useEffect(() => {
    const map = mapRef.current;
    if (map == null) return;
    if (dirtyRef.current) {
      dirtyRef.current = false;
      const snapshot = loadFromSessionStorage<IUserAroundPageSnapshotData>({
        key: USER_AROUND_PAGE_STORAGE_KEY,
        maxDuration: 1 * 24 * 60 * 60 * 1000,
      });
      if (snapshot) {
        setUsers(snapshot.users);
        setEateries(snapshot.eateries);
        setGroceries(snapshot.groceries);
        setDistance(snapshot.distance);
        setMarkets(snapshot.markets);
        setRestaurants(snapshot.restaurants);
        setVolunteers(snapshot.volunteers);
        setSelectedMarker(snapshot.selectedMarker);
        setRoles(snapshot.roles);
        setTimeout(() => {
          setCenter(snapshot.center);
          map.setCenter(snapshot.center);
        }, 500);
      } else {
        setCurrentLocation();
        doLoadArea();
      }
    }
  }, [doLoadArea, setCurrentLocation]);

  const handleBeforeNavigate = () => {
    doSaveStorage();
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
            value={PlaceType.PERSONAL}
            icon={<Person color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Restaurants")}
            value={PlaceType.RESTAURANT}
            icon={<Restaurant color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Eateries")}
            value={PlaceType.EATERY}
            icon={<Storefront color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Grocery")}
            value={PlaceType.GROCERY}
            icon={<LocalConvenienceStore color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Markets")}
            value={PlaceType.SUPERMARKET}
            icon={<LocalGroceryStore color="inherit" />}
          />
          <TogglePurpleChip
            label={lang("Volunteers")}
            value={PlaceType.VOLUNTEER}
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
            {roles.includes(PlaceType.PERSONAL) &&
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
                        <InfoWindowUser
                          onBeforeNavigate={handleBeforeNavigate}
                          user={user}
                        />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Restaurant */}
            {roles.includes(PlaceType.RESTAURANT) &&
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
                    onClick={() => toggleMarker(restaurant._id)}
                  >
                    {selectedMarker === restaurant._id && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(restaurant._id)}
                      >
                        <InfoWindowPlace
                          onBeforeNavigate={handleBeforeNavigate}
                          place={restaurant}
                        />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Eateries */}
            {roles.includes(PlaceType.EATERY) &&
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
                    onClick={() => toggleMarker(eatery._id)}
                  >
                    {selectedMarker === eatery._id && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(eatery._id)}
                      >
                        <InfoWindowPlace
                          onBeforeNavigate={handleBeforeNavigate}
                          place={eatery}
                        />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Grocery */}
            {roles.includes(PlaceType.GROCERY) &&
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
                    onClick={() => toggleMarker(grocery._id)}
                  >
                    {selectedMarker === grocery._id && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(grocery._id)}
                      >
                        <InfoWindowPlace
                          onBeforeNavigate={handleBeforeNavigate}
                          place={grocery}
                        />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Market */}
            {roles.includes(PlaceType.SUPERMARKET) &&
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
                    onClick={() => toggleMarker(market._id)}
                  >
                    {selectedMarker === market._id && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(market._id)}
                      >
                        <InfoWindowPlace
                          onBeforeNavigate={handleBeforeNavigate}
                          place={market}
                        />
                      </InfoWindowF>
                    )}
                  </MarkerF>
                );
              })}

            {/* Volunteer */}
            {roles.includes(PlaceType.VOLUNTEER) &&
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
                    onClick={() => toggleMarker(volunteer._id)}
                  >
                    {selectedMarker === volunteer._id && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(volunteer._id)}
                      >
                        <InfoWindowPlace
                          onBeforeNavigate={handleBeforeNavigate}
                          place={volunteer}
                        />
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
            onClick={doLoadArea}
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
              display: !loadActive ? "none" : "block",
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
                {roles.includes(PlaceType.PERSONAL) && (
                  <Badge badgeContent={users.length} color="info">
                    <Person />
                  </Badge>
                )}
                {roles.includes(PlaceType.RESTAURANT) && (
                  <Badge badgeContent={restaurants.length} color="info">
                    <Restaurant />
                  </Badge>
                )}
                {roles.includes(PlaceType.EATERY) && (
                  <Badge badgeContent={eateries.length} color="info">
                    <Storefront />
                  </Badge>
                )}
                {roles.includes(PlaceType.GROCERY) && (
                  <Badge badgeContent={groceries.length} color="info">
                    <LocalConvenienceStore />
                  </Badge>
                )}
                {roles.includes(PlaceType.SUPERMARKET) && (
                  <Badge badgeContent={markets.length} color="info">
                    <LocalGroceryStore />
                  </Badge>
                )}
                {roles.includes(PlaceType.VOLUNTEER) && (
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
