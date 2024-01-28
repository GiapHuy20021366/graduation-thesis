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
  IFoodSearchInfo,
  ILocation,
  OrderState,
  mapIcons,
} from "../../../data";
import { Box, Chip, IconButton, Stack, Tooltip } from "@mui/material";
import {
  CenterFocusStrongOutlined,
  SettingsSuggestOutlined,
} from "@mui/icons-material";
import {
  useAppContentContext,
  useAuthContext,
  useFoodSearchContext,
  useI18nContext,
  useLoading,
} from "../../../hooks";
import FoodAroundFilter, { IFilterParams } from "./FoodAroundFilter";
import { IFoodSearchParams, foodFetcher } from "../../../api";
import InfoWindowFood from "./InfoWindowFood";

export default function FoodAroundBody() {
  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: GOOGLE_MAP_API_KEY,
  });
  const [center, setCenter] = useState<ICoordinates>({
    lat: 21.02,
    lng: 105.83,
  });

  const [foods, setFoods] = useState<IFoodSearchInfo[]>([]);

  const [infoOpen, setInfoOpen] = useState<boolean>(false);
  const fetching = useLoading();
  const i8nContext = useI18nContext();
  const lang = i8nContext.of(FoodAroundBody);
  const mapRef = useRef<google.maps.Map>();
  const [loadActive, setLoadActive] = useState<boolean>(false);
  const authContext = useAuthContext();
  const auth = authContext.auth;
  const [selectedMarker, setSelectedMarker] = useState<number | string>();
  const [home, setHome] = useState<ILocation>();
  const [filterOpen, setFilterOpen] = useState<boolean>(false);
  const appContentContext = useAppContentContext();
  const searchContext = useFoodSearchContext();

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

  const searchFood = (params: IFoodSearchParams) => {
    if (auth == null) return;
    if (fetching.isActice) return;

    fetching.active();
    foodFetcher
      .searchFood(params, auth)
      .then((data) => {
        setTimeout(() => {
          const datas = data.data;
          if (datas != null && datas.length > 0) {
            setFoods(datas);
          }
          fetching.deactive();
          setLoadActive(false);
        }, 200);
      })
      .catch(() => {
        fetching.deactive();
      });
  };

  const onMapLoaded = (map: google.maps.Map) => {
    mapRef.current = map;
    setTimeout(() => {
      // const saved = localStorage.getItem("around.food.filter.state.filter");
      // if (saved) {
      //   try {
      //     const meta = JSON.parse(saved);
      //     if (meta) {
      //       setAddedBy(meta.addedBy);
      //       setAvailable(meta.available);
      //       setMaxDistance(meta.maxDistance);
      //       setCategories(meta.categories);
      //       setCategoryActive(meta.categoryActive);
      //       setMinQuantity(meta.minQuantity);
      //       setQuantityHover(meta.quantityHover);
      //       setMaxDuration(meta.maxDuration);
      //       setPriceOption(meta.priceOption);
      //       setPriceRange(meta.priceRange);
      //     }
      //   } catch (error) {
      //     // DO nothing
      //   }
      // }
      const paramsToSearch: IFoodSearchParams = {
        addedBy: searchContext.addedBy,
        available: searchContext.available,
        categories: searchContext.categories,
        maxDistance: searchContext.maxDistance,
        maxDuration: searchContext.maxDuration,
        minQuantity: searchContext.minQuantity,
        order: {
          orderDistance: OrderState.NONE,
          orderNew: OrderState.NONE,
          orderPrice: OrderState.NONE,
          orderQuantity: OrderState.NONE,
        },
        price: searchContext.price,
        query: searchContext.query,
        pagination: {
          skip: 0,
          limit: 200,
        },
        currentLocation: appContentContext.currentLocation,
      };
      searchFood(paramsToSearch);
    }, 500);
  };

  const onMapCenterChanged = () => {
    setLoadActive(true);
  };

  const toggleMarker = (index: number | string) => {
    if (selectedMarker === index) setSelectedMarker(undefined);
    else setSelectedMarker(index);
  };

  const onFilterApply = (params: IFilterParams) => {
    const paramsToSearch: IFoodSearchParams = {
      addedBy: params.addedBy,
      available: params.available,
      categories: params.categories,
      maxDistance: params.maxDistance,
      maxDuration: params.maxDuration,
      minQuantity: params.minQuantity,
      order: {
        orderDistance: OrderState.NONE,
        orderNew: OrderState.NONE,
        orderPrice: OrderState.NONE,
        orderQuantity: OrderState.NONE,
      },
      price: params.price,
      query: "",
      pagination: {
        skip: 0,
        limit: 200,
      },
      currentLocation: appContentContext.currentLocation,
    };
    searchFood(paramsToSearch);
    setFilterOpen(false);
  };

  const onMapClick = () => {
    setFilterOpen(false);
  };

  const onButtonLoadClick = () => {
    const paramsToSearch: IFoodSearchParams = {
      addedBy: searchContext.addedBy,
      available: searchContext.available,
      categories: searchContext.categories,
      maxDistance: searchContext.maxDistance,
      maxDuration: searchContext.maxDuration,
      minQuantity: searchContext.minQuantity,
      order: {
        orderDistance: OrderState.NONE,
        orderNew: OrderState.NONE,
        orderPrice: OrderState.NONE,
        orderQuantity: OrderState.NONE,
      },
      price: searchContext.price,
      query: searchContext.query,
      pagination: {
        skip: 0,
        limit: 200,
      },
      currentLocation: appContentContext.currentLocation,
    };
    searchFood(paramsToSearch);
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
            {/* <MarkerF
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
            </MarkerF> */}

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

            {/* {home != null && (
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
            )} */}
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
