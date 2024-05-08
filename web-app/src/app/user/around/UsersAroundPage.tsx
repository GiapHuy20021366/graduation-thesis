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
  IPlaceSearchParams,
  IUserExposedSimple,
  IUserSearchParams,
  OrderState,
  PlaceType,
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
  useAppContentContext,
  useAuthContext,
  useComponentLanguage,
  useDirty,
  useDynamicStorage,
  useLoader,
} from "../../../hooks";
import ToggleChipGroup from "../../common/custom/ToggleChipGroup";
import ToggleChip from "../../common/custom/ToggleChip";
import { userFetcher } from "../../../api";
import InfoWindowUser from "./InfoWindowUser";
import InfoWindowPlace from "./InfoWindowPlace";
import UsersAroundRoles from "./UsersAroundRoles";

interface IUserAroundPageSnapshotData {
  center: ICoordinates;
  users: IUserExposedSimple[];
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

  const storage = useDynamicStorage<IUserAroundPageSnapshotData>(
    USER_AROUND_PAGE_STORAGE_KEY
  );
  const stored = storage.get();
  const [center, setCenter] = useState<ICoordinates>(
    stored?.center ?? {
      lat: 21.02,
      lng: 105.83,
    }
  );

  const [roles, setRoles] = useState<PlaceType[]>(
    stored?.roles ?? [PlaceType.PERSONAL]
  );
  const [users, setUsers] = useState<IUserExposedSimple[]>(stored?.users ?? []);
  const [restaurants, setRestaurants] = useState<IPlaceExposed[]>(
    stored?.restaurants ?? []
  );
  const [eateries, setEateries] = useState<IPlaceExposed[]>(
    stored?.eateries ?? []
  );
  const [groceries, setGroceries] = useState<IPlaceExposed[]>(
    stored?.groceries ?? []
  );
  const [markets, setMarkets] = useState<IPlaceExposed[]>(
    stored?.markets ?? []
  );
  const [volunteers, setVolunteers] = useState<IPlaceExposed[]>(
    stored?.volunteers ?? []
  );

  const authContext = useAuthContext();
  const { auth, account } = authContext;
  const appContentContext = useAppContentContext();
  const { currentLocation } = appContentContext;
  const lang = useComponentLanguage("UsersAroundPage");

  const mapRef = useRef<google.maps.Map>();
  const [distance, setDistance] = useState<number>(stored?.distance ?? 2);
  const [home, setHome] = useState<ILocation>();
  const [selectedMarker, setSelectedMarker] = useState<
    number | string | undefined
  >(stored?.selectedMarker);

  const loader = useLoader();
  const [loadActive, setLoadActive] = useState<boolean>(false);

  useEffect(() => {
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
    storage.update(() => snapshot);
    storage.save();
  }, [
    distance,
    eateries,
    groceries,
    markets,
    restaurants,
    roles,
    selectedMarker,
    storage,
    users,
    volunteers,
  ]);

  const setCurrentLocation = useCallback(() => {
    () => {
      const current = currentLocation;
      if (current) {
        setCenter(current);
      }
    };
  }, [currentLocation]);

  useEffect(() => {
    const userLocation = authContext.account?.location;
    if (userLocation != null && home == null) {
      setHome(userLocation);
    }
  }, [authContext.account, home]);

  const handleLocateMe = () => {
    setCenter({ ...center });
    setSelectedMarker(0);
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
            const datas = data.filter((d) => d._id !== account._id);
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
        distance: {
          current: current,
          max: maxDistance,
        },
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

  const dirty = useDirty();
  useEffect(() => {
    const map = mapRef.current;
    if (map != null && storage.isNew) {
      dirty.perform(() => {
        setCurrentLocation();
        doLoadArea();
      });
    }
  }, [dirty, doLoadArea, setCurrentLocation, storage.isNew]);

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
      <UsersAroundRoles roles={roles} onRolesChange={handleChangeRoles} />
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
              onClick={() => toggleMarker(0)}
            >
              {selectedMarker === 0 && (
                <InfoWindowF
                  position={center}
                  onCloseClick={() => toggleMarker(0)}
                >
                  <Box color={"black"}>
                    <span>{lang("your-current-location")}</span>
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
                    onClick={() => toggleMarker(user._id)}
                  >
                    {selectedMarker === user._id && (
                      <InfoWindowF
                        position={coordinate}
                        onCloseClick={() => toggleMarker(user._id)}
                      >
                        <InfoWindowUser user={user} />
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
                        <InfoWindowPlace place={restaurant} />
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
                        <InfoWindowPlace place={eatery} />
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
                        <InfoWindowPlace place={grocery} />
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
                        <InfoWindowPlace place={market} />
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
                        <InfoWindowPlace place={volunteer} />
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
                onClick={() => toggleMarker(1)}
              >
                {selectedMarker === 1 && (
                  <InfoWindowF
                    position={home.coordinates}
                    onCloseClick={() => toggleMarker(1)}
                  >
                    <Box sx={{ width: 200 }} color={"black"}>
                      <span>{lang("your-home")}</span>
                    </Box>
                  </InfoWindowF>
                )}
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
            label={lang("l-locate-me")}
            sx={{
              width: "fit-content",
              px: 5,
              fontWeight: 600,
              fontSize: "1.3rem",
            }}
            color="primary"
            onClick={handleLocateMe}
            icon={<CenterFocusStrongOutlined color="inherit" />}
          />
          <Chip
            label={lang("l-load-this-area")}
            onClick={doLoadArea}
            sx={{
              width: "fit-content",
              px: 5,
              fontWeight: 600,
              fontSize: "1.3rem",
              display: !loadActive ? "none" : "block",
            }}
            color="primary"
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
                  color: "inherit",
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
                {lang("showing-this-area")}
              </Box>
              <Box>
                <Typography sx={{ fontWeight: 600, mb: 1 }}>
                  {lang("max-distance")}:
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
