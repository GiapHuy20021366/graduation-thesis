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
  OrderState,
  mapIcons,
} from "../../../data";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import {
  CenterFocusStrongOutlined,
  FilterAltOutlined,
} from "@mui/icons-material";
import {
  useAppContentContext,
  useAuthContext,
  useComponentLanguage,
  useDirty,
  useDynamicStorage,
  useFoodSearchContext,
  useLoading,
  useQueryDevice,
} from "../../../hooks";
import FoodAroundFilter, { IFilterParams } from "./FoodAroundFilter";
import { foodFetcher } from "../../../api";
import InfoWindowFood from "./InfoWindowFood";
import FoodViewerDialog from "../../common/viewer/dialog/FoodViewerDialog";

interface IFoodAroundBodySnapshotData {
  center: ICoordinates;
  infoOpen?: number | string;
  groups: IGroupFoodPostExposed[];
}

export interface IGroupFoodPostExposed {
  coordinates: ICoordinates;
  foods: IFoodPostExposed[];
  _id: string;
}

const toGroups = (datas: IFoodPostExposed[]): IGroupFoodPostExposed[] => {
  const map: Record<string, IFoodPostExposed[]> = {};
  datas.forEach((d) => {
    const coors = d.location.coordinates;
    const key = coors.lat.toFixed(4) + "|" + coors.lng.toFixed(4);
    if (map[key] == null) {
      map[key] = [d];
    } else {
      map[key].push(d);
    }
  });
  return Object.values(map).map(
    (d): IGroupFoodPostExposed => ({
      coordinates: d[0].location.coordinates,
      foods: d,
      _id: d[0]._id,
    })
  );
};

const FOOD_AROUND_BODY_STORAGE_KEY = "food.around.body";

export default function FoodAroundBody() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });

  const storage = useDynamicStorage<IFoodAroundBodySnapshotData>(
    FOOD_AROUND_BODY_STORAGE_KEY
  );
  const stored = storage.get();

  const appContentContext = useAppContentContext();
  const { currentLocation } = appContentContext;
  const mapRef = useRef<google.maps.Map>();
  const [center, setCenter] = useState<ICoordinates>(
    stored?.center ??
      appContentContext.currentLocation ?? {
        lat: 21.02,
        lng: 105.83,
      }
  );

  const lang = useComponentLanguage();

  const [groups, setGroups] = useState<IGroupFoodPostExposed[]>(
    stored?.groups ?? []
  );
  const [infoOpen, setInfoOpen] = useState<string | number | undefined>(
    stored?.infoOpen
  );
  const fetching = useLoading();
  const [loadActive, setLoadActive] = useState<boolean>(false);
  const authContext = useAuthContext();
  const { auth, account } = authContext;

  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const searchContext = useFoodSearchContext();

  const [openFood, setOpenFood] = useState<string | undefined>();
  const device = useQueryDevice();

  useEffect(() => {
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
      groups: groups,
      infoOpen: infoOpen,
    };

    storage.update(() => snapshot);
    storage.save();
  }, [groups, infoOpen, storage]);

  const setCurrentLocation = useCallback(() => {
    () => {
      const current = currentLocation;
      if (current != null) {
        setCenter(current);
      }
    };
  }, [currentLocation]);

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
            setGroups(toGroups(datas));
          }
          fetching.deactive();
          setLoadActive(false);
        })
        .catch(() => {
          fetching.deactive();
        });
    },
    [auth, fetching]
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
        max: searchContext.maxDistance ?? 20,
      },
      pagination: {
        skip: 0,
        limit: 5000,
      },
      order: {
        distance: OrderState.INCREASE,
      },
    };
    searchFood(params);
    setOpenFood(undefined);
    setInfoOpen(undefined);
  }, [searchContext, searchFood]);

  const dirty = useDirty();
  useEffect(() => {
    const map = mapRef.current;
    if (map != null && storage.isNew) {
      dirty.perform(() => {
        setCurrentLocation();
        doSearch();
      });
    }
  }, [dirty, doSearch, setCurrentLocation, storage.isNew]);

  const handleLocateMe = () => {
    setCenter({ ...center });
    setInfoOpen(0);
  };

  const onMapLoaded = (map: google.maps.Map) => {
    mapRef.current = map;
  };

  const onMapCenterChanged = () => {
    setLoadActive(true);
  };

  const toggleMarker = (index: number | string) => {
    if (infoOpen === index) {
      setInfoOpen(undefined);
    } else {
      setInfoOpen(index);
    }
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

    const accountId = authContext.account?._id;

    const paramsToSearch: IFoodSearchParams = {
      category: params.categories,
      active: true,
      addedBy: params.addedBy,
      available: params.available,
      maxDuration: params.maxDuration,
      minQuantity: params.minQuantity,
      price: params.price,
      user: {
        exclude: accountId ? [accountId] : undefined,
      },
      populate: {
        user: false,
        place: false,
      },
      distance: {
        current: current,
        max: searchContext.maxDistance ?? 2,
      },
      pagination: {
        skip: 0,
        limit: Number.MAX_SAFE_INTEGER,
      },
      order: {
        distance: OrderState.INCREASE,
      },
    };
    searchFood(paramsToSearch);
    setOpenFood(undefined);
    setInfoOpen(undefined);

    // Update context
    searchContext.setAddedBy(params.addedBy);
    searchContext.setAvailable(params.available);
    searchContext.setMaxDistance(params.maxDistance);
    searchContext.setMaxDuration(params.maxDuration);
    searchContext.setCategories(params.categories);
    searchContext.setMinQuantity(params.minQuantity);
    searchContext.setPrice(params.price);
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
          arrow
          children={
            <IconButton
              color="success"
              onClick={() => setFilterOpen(true)}
              size="medium"
            >
              <FilterAltOutlined />
            </IconButton>
          }
          title={lang("open-filter")}
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
              onClick={() => toggleMarker(0)}
            >
              {infoOpen === 0 && (
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

            {groups.map((group, i) => {
              const coordinate = group.coordinates;
              return (
                <MarkerF
                  icon={{
                    url: mapIcons.homePin,
                    scaledSize: new google.maps.Size(30, 30),
                  }}
                  key={i}
                  position={coordinate}
                  onClick={() => toggleMarker(group._id)}
                >
                  {infoOpen === group._id && (
                    <InfoWindowF
                      position={coordinate}
                      onCloseClick={() => toggleMarker(group._id)}
                    >
                      <Box color={"black"}>
                        <InfoWindowFood
                          group={group}
                          onOpen={(id) => setOpenFood(id)}
                        />
                      </Box>
                    </InfoWindowF>
                  )}
                </MarkerF>
              );
            })}

            {account?.location != null && (
              <MarkerF
                icon={{
                  url: mapIcons.homeGreen,
                  scaledSize: new google.maps.Size(40, 40),
                }}
                position={account.location.coordinates}
              >
                {infoOpen === 1 && (
                  <InfoWindowF
                    position={account.location.coordinates}
                    onCloseClick={() => toggleMarker(1)}
                  >
                    <Box color={"black"}>
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
            onClick={onButtonLoadClick}
            sx={{
              width: "fit-content",
              px: 5,
              fontWeight: 600,
              fontSize: "1.3rem",
              display: fetching.isActice || !loadActive ? "none" : "block",
            }}
            color="primary"
          />
        </Stack>
      </Box>
      {openFood != null && (
        <FoodViewerDialog
          id={openFood}
          open={true}
          onClose={() => setOpenFood(undefined)}
          onCloseClick={() => setOpenFood(undefined)}
          fullScreen={device === "MOBILE"}
        />
      )}
    </Stack>
  );
}
