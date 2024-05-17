import { History, SearchOutlined, TuneOutlined } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  Tab,
  Tabs,
  TextField,
  Tooltip,
} from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  ICoordinates,
  IFoodPostExposed,
  IFoodSeachOrder,
  IFoodSearchParams,
  toNextOrderState,
} from "../../../data";
import FoodSearchItem from "./FoodSearchItem";
import FoodSearchFilter, { IFilterParams } from "./FoodSearchFilter";
import {
  useAppContentContext,
  useAuthContext,
  useDirty,
  useDynamicStorage,
  useFoodSearchContext,
  useI18nContext,
  useLoader,
} from "../../../hooks";
import { IFoodSearchContext } from "./FoodSearchContext";
import FoodItemSkeleton from "./FoodItemSkeleton";
import {
  IFoodSearchHistoryParams,
  IFoodSearchHistoryExposed,
  foodFetcher,
} from "../../../api";
import OrderIcon from "../../common/custom/OrderIcon";
import ListEnd from "../../common/viewer/data/ListEnd";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";
import EmptyList from "../../common/viewer/data/EmptyList";

const SearchTab = {
  RELATED: 0,
  TIME: 1,
  DISTANCE: 2,
  PRICE: 3,
  QUANTITY: 4,
} as const;

type SearchTab = (typeof SearchTab)[keyof typeof SearchTab];

const toOrder = (
  tab: SearchTab,
  searchContext: IFoodSearchContext
): IFoodSeachOrder => {
  const result: IFoodSeachOrder = {};
  switch (tab) {
    case SearchTab.RELATED:
      break;
    case SearchTab.PRICE:
      result.price = searchContext.order?.price;
      break;
    case SearchTab.DISTANCE:
      result.distance = searchContext.order?.distance;
      break;
    case SearchTab.QUANTITY:
      result.quantity = searchContext.order?.quantity;
      break;
    case SearchTab.TIME:
      result.time = searchContext.order?.time;
      break;
  }
  return result;
};

const toSearchParams = (
  context: IFoodSearchContext,
  location?: ICoordinates,
  order?: IFoodSeachOrder
): IFoodSearchParams => {
  const result: IFoodSearchParams = {};

  result.category = context.categories;
  result.duration = {};
  if (context.maxDuration != null) {
    result.duration.to = Date.now() + context.maxDuration * 24 * 60 * 60 * 1000;
  }
  switch (context.available) {
    case "ALL":
      break;
    case "AVAILABLE_ONLY":
      result.duration.from = Date.now();
      break;
    case "JUST_GONE":
      result.duration.to = Date.now() - 1;
  }
  if (context.minQuantity != null) {
    result.quantity = {
      min: context.minQuantity,
    };
  }
  result.addedBy = context.addedBy;

  if (context.query && context.query.trim().length > 0) {
    result.query = context.query;
  }

  if (context.maxDistance != null && location) {
    result.distance = {
      max: context.maxDistance,
      current: location,
    };
  }

  result.order = order;
  result.active = true;
  result.resolved = false;

  if (context.price != null) {
    result.price = {
      min: context.price.min,
      max: context.price.max,
    };
  }
  return result;
};

type IFoodSearchHistoryAndKey = IFoodSearchHistoryExposed & {
  key: number | string;
};

interface IFoodSearchBodySnapshotData {
  tab: SearchTab;
  foods: IFoodPostExposed[];
  scrollTop?: number;
}

const FOOD_SEARCH_BODY_STORAGE_KEY = "food.search.body";

export default function FoodSearchBody() {
  const storage = useDynamicStorage<IFoodSearchBodySnapshotData>(
    FOOD_SEARCH_BODY_STORAGE_KEY
  );
  const stored = storage.get();

  const inputRef = useRef<HTMLInputElement>(null);
  const [foods, setFoods] = useState<IFoodPostExposed[]>(stored?.foods ?? []);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [options, setOptions] = useState<IFoodSearchHistoryAndKey[]>([]);
  const [tab, setTab] = useState<SearchTab>(stored?.tab ?? SearchTab.RELATED);
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(FoodSearchBody);
  const loader = useLoader();

  const searchContext = useFoodSearchContext();
  const {
    query,
    setQuery,
    setOrderDistance,
    setOrderPrice,
    setOrderNew,
    setOrderQuantity,
    order,
  } = searchContext;

  const {
    distance: orderDistance,
    time: orderNew,
    price: orderPrice,
    quantity: orderQuantity,
  } = order;

  const authContext = useAuthContext();
  const { auth } = authContext;
  const appContentContext = useAppContentContext();

  useEffect(() => {
    if (storage.isNew) {
      inputRef.current?.focus();
    }
  }, [storage.isNew]);

  const doSaveStorage = useCallback(() => {
    const snapshot: IFoodSearchBodySnapshotData = {
      foods,
      tab,
      scrollTop: appContentContext.mainRef?.current?.scrollTop,
    };
    storage.update(() => snapshot);
    storage.save();
  }, [appContentContext.mainRef, foods, storage, tab]);

  const handleInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setQuery(value);
  };

  useEffect(() => {
    const params: IFoodSearchHistoryParams = {};
    if (authContext.account != null) {
      params.users = [authContext.account._id];
    }
    if (query && query.trim() !== "") {
      params["query"] = query.trim();
    }
    if (authContext.auth != null) {
      foodFetcher.searchHistory(params, authContext.auth).then((data) => {
        const datas = data.data;
        if (datas && datas.length > 0) {
          const _options: IFoodSearchHistoryAndKey[] = [];
          if (query && query.length > 0) {
            _options.push({
              key: 0,
              query: query ?? "",
              userId: "0",
            });
          }
          _options.push(
            ...datas.map((data, index) => ({
              ...data,
              key: index + 1,
            }))
          );
          setOptions(_options);
        }
      });
    }
  }, [authContext.account, authContext.auth, query]);

  const searchFood = useCallback(
    (params: IFoodSearchParams) => {
      if (auth == null) return;
      if (loader.isFetching) return;

      loader.setIsEnd(false);
      loader.setIsError(false);
      loader.setIsFetching(true);

      setFoods([]);
      foodFetcher
        .searchFood(
          {
            ...params,
            active: true,
            resolved: false,
          },
          auth
        )
        .then((data) => {
          const datas = data.data;
          if (datas != null) {
            if (datas.length < 24) {
              loader.setIsEnd(true);
            }
            setFoods(datas);
          }
        })
        .catch(() => {
          loader.setIsError(true);
        })
        .finally(() => {
          loader.setIsFetching(false);
          doSaveStorage();
        });
    },
    [auth, doSaveStorage, loader]
  );

  const doSearch = useCallback(() => {
    searchFood(
      toSearchParams(searchContext, appContentContext.currentLocation)
    );
  }, [appContentContext.currentLocation, searchContext, searchFood]);

  const handleSearchQueryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: IFoodSearchHistoryExposed | string | null
  ): void => {
    const val = typeof value === "string" ? value : value?.query ?? "";
    setQuery(val);
    if (value) {
      searchFood(
        toSearchParams(
          { ...searchContext, query: val },
          appContentContext.currentLocation
        )
      );
    }
  };

  const onTabRelativeClick = () => {
    if (tab === SearchTab.RELATED) return;
    const searchParams: IFoodSearchParams = toSearchParams(
      {
        ...searchContext,
      },
      appContentContext.currentLocation
    );
    searchFood(searchParams);
  };

  const onTabOrderNewClick = () => {
    const newOrder =
      tab === SearchTab.TIME ? toNextOrderState(orderNew) : orderNew;
    setOrderNew(newOrder);
    const order: IFoodSeachOrder = {
      time: newOrder,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      searchContext,
      appContentContext.currentLocation,
      order
    );
    searchFood(searchParams);
  };

  const onTabOrderDistanceClick = () => {
    const distanceOrder =
      tab === SearchTab.DISTANCE
        ? toNextOrderState(orderDistance)
        : orderDistance;
    setOrderDistance(distanceOrder);
    const order: IFoodSeachOrder = {
      distance: distanceOrder,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      searchContext,
      appContentContext.currentLocation,
      order
    );
    searchFood(searchParams);
  };

  const onTabOrderPriceClick = () => {
    const priceOrder =
      tab === SearchTab.PRICE ? toNextOrderState(orderPrice) : orderPrice;
    setOrderPrice(priceOrder);
    const order: IFoodSeachOrder = {
      price: priceOrder,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      searchContext,
      appContentContext.currentLocation,
      order
    );
    searchFood(searchParams);
  };

  const onTabOrderQuantityClick = () => {
    const quantityOrder =
      tab === SearchTab.QUANTITY
        ? toNextOrderState(orderQuantity)
        : orderQuantity;
    setOrderQuantity(quantityOrder);
    const order: IFoodSeachOrder = {
      quantity: quantityOrder,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      searchContext,
      appContentContext.currentLocation,
      order
    );
    searchFood(searchParams);
  };

  const onApplyFilter = (params: IFilterParams): void => {
    setOpenFilter(false);
    const currentLocation = appContentContext.currentLocation;
    if (currentLocation == null && params.maxDistance != null) return;

    searchContext.setAddedBy(params.addedBy);
    searchContext.setAvailable(params.available);
    searchContext.setMaxDistance(params.maxDistance);
    searchContext.setMaxDuration(params.maxDuration);
    searchContext.setCategories(params.categories);
    searchContext.setMinQuantity(params.minQuantity);
    searchContext.setPrice(params.price);
    const order = toOrder(tab, {
      ...searchContext,
      ...params,
    });
    const searchParams: IFoodSearchParams = {
      order,
      query,
      ...params,
      distance:
        params.maxDistance != null
          ? {
              max: params.maxDistance,
              current: currentLocation!,
            }
          : undefined,
    };
    searchFood(searchParams);
  };

  const doSearchMore = useCallback(() => {
    if (auth == null) return;
    if (loader.isFetching) return;

    const params = toSearchParams(
      searchContext,
      appContentContext.currentLocation
    );
    params.pagination = {
      skip: foods.length,
      limit: 24,
    };

    loader.setIsEnd(false);
    loader.setIsError(false);
    loader.setIsFetching(true);

    foodFetcher
      .searchFood(
        {
          ...params,
          active: true,
          resolved: false,
        },
        auth
      )
      .then((data) => {
        const datas = data.data;
        if (datas != null) {
          if (datas.length < 24) {
            loader.setIsEnd(true);
          }
          const newData = [...foods, ...datas];
          setFoods(newData);
        }
      })
      .catch(() => {
        loader.setIsError(true);
      })
      .finally(() => {
        loader.setIsFetching(false);
        doSaveStorage();
      });
  }, [
    auth,
    loader,
    searchContext,
    appContentContext.currentLocation,
    foods,
    doSaveStorage,
  ]);

  useEffect(() => {
    const mainRef = appContentContext.mainRef?.current;
    let listener = null;
    if (mainRef != null) {
      listener = (event: Event) => {
        const element = event.target as HTMLDivElement;
        const isAtBottom =
          element.scrollHeight * 0.95 <=
          element.scrollTop + element.clientHeight;
        if (isAtBottom && !loader.isEnd && !loader.isFetching) {
          doSearchMore();
        }
      };
      mainRef.addEventListener("scroll", listener);
    }
    return () => {
      mainRef && mainRef.removeEventListener("scroll", listener!);
    };
  }, [
    appContentContext.mainRef,
    doSearchMore,
    loader.isEnd,
    loader.isFetching,
  ]);

  const dirty = useDirty();
  useEffect(() => {
    if (auth != null) {
      dirty.perform(() => {
        if (storage.isNew) {
          doSearch();
        } else {
          const main = appContentContext.mainRef?.current;
          if (main && stored != null) {
            setTimeout(() => {
              main.scrollTop = stored.scrollTop ?? 0;
            }, 0);
          }
        }
      });
    }
  }, [appContentContext.mainRef, auth, dirty, doSearch, storage.isNew, stored]);

  return (
    <Box width={"100%"} boxSizing={"border-box"}>
      <Stack width="100%" direction="column">
        <Box
          sx={{
            position: "sticky",
            top: 0,
            width: "100%",
            padding: "5px",
            boxSizing: "border-box",
            zIndex: 100,
            backgroundColor: "background.default",
          }}
        >
          <Autocomplete
            freeSolo
            fullWidth
            options={options}
            filterOptions={(options) => options}
            inputValue={query}
            value={query}
            onInputChange={handleInputChange}
            onChange={handleSearchQueryChange}
            getOptionLabel={(option) =>
              typeof option === "string" ? option : option.query
            }
            sx={{
              width: ["100%", "90%", "80%"],
            }}
            renderOption={(props, option) => (
              <ListItem disablePadding {...props} key={option.key}>
                <ListItemIcon>
                  <SearchOutlined />
                </ListItemIcon>
                <ListItemText primary={option.query} />
                {option.userId === authContext?.account?._id && (
                  <ListItemIcon>
                    <History />
                  </ListItemIcon>
                )}
              </ListItem>
            )}
            renderInput={(params) => (
              <TextField
                inputRef={inputRef}
                {...params}
                margin="normal"
                variant="outlined"
                placeholder={lang("search-placeholder")}
                InputProps={{
                  ...params.InputProps,
                  id: "f-s-b-input-search",
                  style: {
                    borderRadius: 40,
                    paddingLeft: "1em",
                    margin: "auto",
                  },
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchOutlined />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <>
                      {params.InputProps.endAdornment}
                      <InputAdornment position="end">
                        <Tooltip arrow title={lang("l-search")}>
                          <IconButton
                            color="info"
                            onClick={() => doSearch()}
                            id="f-s-b-btn-search"
                          >
                            <SearchOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          arrow
                          title={lang("l-advance-search")}
                          onClick={() => setOpenFilter(true)}
                        >
                          <IconButton color="info" id="f-s-b-btn-filter">
                            <TuneOutlined />
                          </IconButton>
                        </Tooltip>
                      </InputAdornment>
                    </>
                  ),
                }}
              />
            )}
          />
          <Stack width="100%" direction={"row"}>
            <Tabs
              value={tab}
              onChange={(
                _event: React.SyntheticEvent<Element, Event>,
                value: any
              ) => setTab(value)}
              variant="scrollable"
              scrollButtons={false}
              sx={{
                ".MuiTab-root": {
                  textTransform: "initial",
                },
              }}
            >
              <Tab label={lang("l-relative")} onClick={onTabRelativeClick} />
              <Tab
                label={lang("l-time")}
                icon={<OrderIcon order={orderNew} />}
                iconPosition="end"
                onClick={onTabOrderNewClick}
              />
              <Tab
                label={lang("l-distance")}
                icon={<OrderIcon order={orderDistance} />}
                iconPosition="end"
                onClick={onTabOrderDistanceClick}
              />
              <Tab
                label={lang("l-price")}
                icon={<OrderIcon order={orderPrice} />}
                iconPosition="end"
                onClick={onTabOrderPriceClick}
              />
              <Tab
                label={lang("l-quantity")}
                icon={<OrderIcon order={orderQuantity} />}
                iconPosition="end"
                onClick={onTabOrderQuantityClick}
              />
            </Tabs>
          </Stack>
        </Box>
        <Divider />
        <FoodSearchFilter
          isActive={openFilter}
          onClose={() => setOpenFilter(false)}
          onApply={(params) => onApplyFilter(params)}
        />
        <Stack
          flex={1}
          sx={{
            overflowY: "auto",
            width: "100%",
            boxSizing: "border-box",
          }}
          id="f-s-b-food-container"
        >
          {foods.map((food) => {
            return (
              <FoodSearchItem
                item={food}
                key={food._id}
                onBeforeNavigate={() => doSaveStorage()}
              />
            );
          })}
          {loader.isFetching && <FoodItemSkeleton />}
          <ListEnd
            active={loader.isEnd && !loader.isError && foods.length > 0}
            onRetry={doSearchMore}
            id="f-s-b-list-end"
          />
          <ErrorRetry
            active={!loader.isFetching && loader.isError}
            onRetry={doSearchMore}
            id="f-s-b-error-retry"
          />
          <EmptyList
            active={!loader.isFetching && !loader.isError && foods.length === 0}
            onRetry={doSearchMore}
            id="f-s-b-empty-list"
          />
        </Stack>
      </Stack>
    </Box>
  );
}
