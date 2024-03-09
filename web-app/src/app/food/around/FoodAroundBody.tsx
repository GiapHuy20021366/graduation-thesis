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
  IFoodPostExposed,
  IFoodSearchParams,
  ILocation,
  OrderState,
  loadFromSessionStorage,
  mapIcons,
  saveToSessionStorage,
} from "../../../data";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import {
  CenterFocusStrongOutlined,
  SettingsSuggestOutlined,
} from "@mui/icons-material";
import {
  useAuthContext,
  useDistanceCalculation,
  useFoodSearchContext,
  useLoading,
} from "../../../hooks";
import FoodAroundFilter, { IFilterParams } from "./FoodAroundFilter";
import { foodFetcher } from "../../../api";
import InfoWindowFood from "./InfoWindowFood";

interface IFoodAroundBodySnapshotData {
  center: ICoordinates;
  foods: IFoodPostExposed[];
  selectedMarker?: number | string;
}

const FOOD_AROUND_BODY_STORAGE_KEY = "food.around.body";

export default function FoodAroundBody() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [center, setCenter] = useState<ICoordinates>({
    lat: 21.02,
    lng: 105.83,
  });

  const [foods, setFoods] = useState<IFoodPostExposed[]>([]);

  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const fetching = useLoading();
  const mapRef = useRef<google.maps.Map>();
  const [loadActive, setLoadActive] = useState<boolean>(false);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const [selectedMarker, setSelectedMarker] = useState<string | number>();
  const [home, setHome] = useState<ILocation>();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const searchContext = useFoodSearchContext();
  const distances = useDistanceCalculation();
  const dirtyRef = useRef<boolean>(true);

  const doSaveStorage = useCallback(() => {
    const map = mapRef.current;
    if (map == null) return;
    const center = map.getCenter();
    if (center == null) return;

    const current: ICoordinates = {
      lat: center.lat(),
      lng: center.lng(),
    };

    const snapshot: IFoodAroundBodySnapshotData = {
      center: current,
      foods: foods,
      selectedMarker: selectedMarker,
    };
    saveToSessionStorage(snapshot, {
      key: FOOD_AROUND_BODY_STORAGE_KEY,
    });
  }, [foods, selectedMarker]);

  const setCurrentLocation = useCallback(() => {
    () => {
      const current = distances.currentLocation;
      if (current != null) {
        setCenter(current.coordinates);
      }
    };
  }, [distances.currentLocation]);

  const searchFood = useCallback(
    (params: IFoodSearchParams) => {
      if (auth == null) return;
      if (fetching.isActice) return;

      fetching.active();
      foodFetcher
        .searchFood(params, auth)
        .then((data) => {
          const datas = data.data;
          if (datas != null && datas.length > 0) {
            setFoods(datas);
            setTimeout(() => {
              doSaveStorage();
            }, 0);
          }
          fetching.deactive();
          setLoadActive(false);
        })
        .catch(() => {
          fetching.deactive();
        });
    },
    [auth, doSaveStorage, fetching]
  );

  const doSearch = useCallback(() => {
    const map = mapRef.current;
    if (map == null) return;
    const center = map.getCenter();
    if (center == null) return;

    const current: ICoordinates = {
      lat: center.lat(),
      lng: center.lng(),
    };

    const params: IFoodSearchParams = {
      category: searchContext.categories,
      active: true,
      addedBy: searchContext.addedBy,
      available: searchContext.available,
      maxDuration: searchContext.maxDuration,
      minQuantity: searchContext.minQuantity,
      price: searchContext.price,
      populate: {
        user: false,
        place: false,
      },
      distance: {
        current: current,
        max: searchContext.maxDistance ?? Number.MAX_SAFE_INTEGER,
      },
      pagination: {
        skip: 0,
        limit: 200,
      },
      order: {
        distance: OrderState.INCREASE,
      },
    };
    searchFood(params);
  }, [
    searchContext.addedBy,
    searchContext.available,
    searchContext.categories,
    searchContext.maxDistance,
    searchContext.maxDuration,
    searchContext.minQuantity,
    searchContext.price,
    searchFood,
  ]);

  useEffect(() => {
    const map = mapRef.current;
    if (map == null) return;
    if (dirtyRef.current) {
      dirtyRef.current = false;
      const snapshot = loadFromSessionStorage<IFoodAroundBodySnapshotData>({
        key: FOOD_AROUND_BODY_STORAGE_KEY,
        maxDuration: 1 * 24 * 60 * 60 * 1000,
      });
      if (snapshot) {
        setCenter(snapshot.center);
        setFoods(snapshot.foods);
        setSelectedMarker(snapshot.selectedMarker);
      } else {
        setCurrentLocation();
        doSearch();
      }
    }
  }, [doSearch, setCurrentLocation]);

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

  const onMapLoaded = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onMapCenterChanged = () => {
    setLoadActive(true);
  };

  const toggleMarker = (index: number | string) => {
    if (selectedMarker === index) setSelectedMarker(undefined);
    else setSelectedMarker(index);
  };

  const onFilterApply = (params: IFilterParams) => {
    setFilterOpen(false);

    const map = mapRef.current;
    if (map == null) return;
    const center = map.getCenter();
    if (center == null) return;

    const current: ICoordinates = {
      lat: center.lat(),
      lng: center.lng(),
    };

    const paramsToSearch: IFoodSearchParams = {
      category: params.categories,
      active: true,
      addedBy: params.addedBy,
      available: params.available,
      maxDuration: params.maxDuration,
      minQuantity: params.minQuantity,
      price: params.price,
      populate: {
        user: false,
        place: false,
      },
      distance: {
        current: current,
        max: searchContext.maxDistance ?? Number.MAX_SAFE_INTEGER,
      },
      pagination: {
        skip: 0,
        limit: 200,
      },
      order: {
        distance: OrderState.INCREASE,
      },
    };
    searchFood(paramsToSearch);
  };

  const onMapClick = () => {
    setFilterOpen(false);
  };

  const onButtonLoadClick = () => {
    doSearch();
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
      boxShadow={1}
      mt={1}
    >
      {filterOpen && (
        <FoodAroundFilter
          onCloseClick={() => setFilterOpen(false)}
          onApply={onFilterApply}
        />
      )}
      <Box
        sx={{
          position: "absolute",
          right: 60,
          top: 10,
          zIndex: 999,
          backgroundColor: "white",
        }}
      >
        <Tooltip
          children={
            <IconButton color="info" onClick={() => setFilterOpen(true)}>
              <SettingsSuggestOutlined />
            </IconButton>
          }
          title={"Open filter"}
        />
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
            onClick={onMapClick}
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

            {foods.map((food, i) => {
              const coordinate = food.location?.coordinates;
              if (coordinate == null) return <></>;
              return (
                <MarkerF
                  icon={{
                    url: mapIcons.homePin,
                    scaledSize: new google.maps.Size(30, 30),
                  }}
                  key={i}
                  position={coordinate}
                  onClick={() => toggleMarker(food._id)}
                >
                  {selectedMarker === food._id && (
                    <InfoWindowF
                      position={coordinate}
                      onCloseClick={() => toggleMarker(food._id)}
                    >
                      <InfoWindowFood food={food} />
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
            onClick={onButtonLoadClick}
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
      </Box>
    </Stack>
  );
}
