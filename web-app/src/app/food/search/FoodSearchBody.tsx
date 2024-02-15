import {
  History,
  SearchOutlined,
  TuneOutlined,
} from "@mui/icons-material";
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
  IFoodSearchInfo,
  OrderState,
  toNextOrderState,
} from "../../../data";
import FoodSearchItem from "./FoodSearchItem";
import { IFoodSeachOrder, IFoodSearchParams, foodFetcher } from "../../../api";
import FoodSearchFilter, { IFilterParams } from "./FoodSearchFilter";
import {
  useAppContentContext,
  useAuthContext,
  useFoodSearchContext,
  useI18nContext,
  useLoading,
} from "../../../hooks";
import { IFoodSearchContext } from "./FoodSearchContext";
import FoodItemSkeleton from "./FoodItemSkeleton";
import { IFoodSearchHistorySimple } from "../../../api/food";
import OutSearchResult from "../../common/OutSearchResult";
import OrderIcon from "../../common/custom/OrderIcon";

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
  const result: IFoodSeachOrder = {
    orderDistance: OrderState.NONE,
    orderPrice: OrderState.NONE,
    orderNew: OrderState.NONE,
    orderQuantity: OrderState.NONE,
  };
  switch (tab) {
    case SearchTab.RELATED:
      break;
    case SearchTab.PRICE:
      result.orderPrice = searchContext.order.orderPrice;
      break;
    case SearchTab.DISTANCE:
      result.orderDistance = searchContext.order.orderDistance;
      break;
    case SearchTab.QUANTITY:
      result.orderQuantity = searchContext.order.orderQuantity;
      break;
    case SearchTab.TIME:
      result.orderNew = searchContext.order.orderNew;
      break;
  }
  return result;
};

const toSearchParams = (
  context: IFoodSearchContext,
  location?: ICoordinates
): IFoodSearchParams => {
  return {
    categories: context.categories,
    maxDistance: context.maxDistance,
    maxDuration: context.maxDuration,
    minQuantity: context.minQuantity,
    order: context.order,
    price: context.price,
    query: context.query,
    addedBy: context.addedBy,
    available: context.available,
    currentLocation: location,
  };
};

type IFoodSearchHistoryAndKey = IFoodSearchHistorySimple & {
  key: number;
};

export default function FoodSearchBody() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<IFoodSearchInfo[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [options, setOptions] = useState<IFoodSearchHistoryAndKey[]>([]);
  const [tab, setTab] = useState<SearchTab>(SearchTab.RELATED);
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(FoodSearchBody);
  const [isOut, setIsOut] = useState<boolean>(false);

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

  const { orderDistance, orderNew, orderPrice, orderQuantity } = order;

  const authContext = useAuthContext();
  const auth = authContext.auth;

  const searching = useLoading();
  const appContentContext = useAppContentContext();

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleInputChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string
  ) => {
    setQuery(value);
  };

  useEffect(() => {
    const params: any = {};
    if (query.trim() === "" && authContext.account != null) {
      params["users"] = [authContext.account.id_];
    }
    if (query.trim() !== "") {
      params["query"] = query.trim();
    }
    if (authContext.auth != null) {
      foodFetcher.searchHistory(params, authContext.auth).then((data) => {
        const datas = data.data;
        if (datas && datas.length > 0) {
          setOptions(datas.map((data, index) => ({ ...data, key: index })));
        }
      });
    }
  }, [authContext.account, authContext.auth, query]);

  const searchFood = (params: IFoodSearchParams) => {
    if (auth == null) return;
    if (!params.query) return;
    if (searching.isActice) return;

    setIsOut(false);

    searching.active();
    setResult([]);
    foodFetcher
      .searchFood(params, auth)
      .then((data) => {
        setTimeout(() => {
          const datas = data.data;
          if (datas == null || datas.length === 0) {
            setIsOut(true);
          } else {
            setResult(datas);
          }
          searching.deactive();
        }, 200);
      })
      .catch(() => {
        searching.deactive();
      });
  };

  const doSearch = () => {
    searchFood(
      toSearchParams(searchContext, appContentContext.currentLocation)
    );
  };

  const handleSearchQueryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: IFoodSearchHistorySimple | string | null
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
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: OrderState.NONE,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      {
        ...searchContext,
        order,
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
      orderDistance: OrderState.NONE,
      orderNew: newOrder,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      {
        ...searchContext,
        order,
      },
      appContentContext.currentLocation
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
      orderDistance: distanceOrder,
      orderNew: OrderState.NONE,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      {
        ...searchContext,
        order,
      },
      appContentContext.currentLocation
    );
    searchFood(searchParams);
  };

  const onTabOrderPriceClick = () => {
    const priceOrder =
      tab === SearchTab.PRICE ? toNextOrderState(orderPrice) : orderPrice;
    setOrderPrice(priceOrder);
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: OrderState.NONE,
      orderPrice: priceOrder,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      {
        ...searchContext,
        order,
      },
      appContentContext.currentLocation
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
      orderDistance: OrderState.NONE,
      orderNew: OrderState.NONE,
      orderPrice: OrderState.NONE,
      orderQuantity: quantityOrder,
    };
    const searchParams: IFoodSearchParams = toSearchParams(
      {
        ...searchContext,
        order,
      },
      appContentContext.currentLocation
    );
    searchFood(searchParams);
  };

  const onApplyFilter = (params: IFilterParams): void => {
    setOpenFilter(false);
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
      currentLocation: appContentContext.currentLocation,
    };
    searchFood(searchParams);
  };

  const tryDoSearchMore = () => {
    setIsOut(false);
    doSearchMore();
  };

  const doSearchMore = useCallback(() => {
    if (isOut) return;
    if (auth == null) return;
    if (!searchContext.query) return;
    if (searching.isActice) return;
    const params = toSearchParams(
      searchContext,
      appContentContext.currentLocation
    );
    params.pagination = {
      skip: result.length,
      limit: 24,
    };

    searching.active();
    foodFetcher
      .searchFood(params, auth)
      .then((data) => {
        setTimeout(() => {
          const datas = data.data ?? [];
          if (datas.length === 0) {
            setIsOut(true);
          } else {
            const newData = [...result, ...datas];
            setResult(newData);
          }
          searching.deactive();
        }, 1000);
      })
      .catch(() => {
        searching.deactive();
      });
  }, [
    appContentContext.currentLocation,
    auth,
    isOut,
    result,
    searchContext,
    searching,
  ]);

  useEffect(() => {
    const mainRef = appContentContext.mainRef?.current;
    let listener = null;
    if (mainRef != null) {
      listener = (event: Event) => {
        const element = event.target as HTMLDivElement;
        const isAtBottom =
          element.scrollTop + element.clientHeight === element.scrollHeight;

        if (isAtBottom) {
          doSearchMore();
        }
      };
      mainRef.addEventListener("scroll", listener);
    }
    return () => {
      mainRef && mainRef.removeEventListener("scroll", listener!);
    };
  }, [appContentContext.mainRef, doSearchMore]);

  const backup = () => {
    const mainCur = appContentContext.mainRef?.current;
    const scroll = {
      scrollX: mainCur?.scrollLeft ?? 0,
      scrollY: mainCur?.scrollTop ?? 0,
    };
    const save = JSON.stringify({
      ...searchContext,
      scroll,
      result,
      tab,
    });
    localStorage.setItem("food.search.state", save);
    console.log("save", save);
  };

  const restore = () => {
    try {
      const saved = localStorage.getItem("food.search.state");
      if (!saved) return;
      const meta = JSON.parse(saved);
      console.log(meta);
      if (meta != null) {
        searchContext.setAddedBy(meta.addedBy);
        searchContext.setAvailable(meta.available);
        searchContext.setCategories(meta.categories);
        searchContext.setMaxDistance(meta.maxDistance);
        searchContext.setMaxDuration(meta.maxDuration);
        searchContext.setMinQuantity(meta.minQuantity);
        searchContext.setOrderDistance(meta.order.orderDistance);
        searchContext.setOrderNew(meta.order.orderNew);
        searchContext.setOrderQuantity(meta.order.orderQuantity);
        searchContext.setOrderPrice(meta.order.orderPrice);
        searchContext.setPrice(meta.price);
        searchContext.setQuery(meta.query);
        setResult(meta.result);
        setTab(meta.tab);
        const mainCur = appContentContext.mainRef?.current;
        if (mainCur) {
          setTimeout(() => {
            mainCur.scrollTo(meta.scroll.scrollX, meta.scroll.scrollY);
          }, 200);
        }
      }
    } catch (error) {
      // DO nothing
    }
  };

  useEffect(() => {
    restore();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Box width={"100%"} boxSizing={"border-box"}>
      <Stack width="100%" direction="column">
        <Box
          sx={{
            position: "sticky",
            top: 1,
            mt: 1,
            width: "100%",
            padding: "5px",
            boxSizing: "border-box",
            backgroundColor: "white",
            zIndex: 100,
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
                {option.userId === authContext?.account?.id_ && (
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
                        <Tooltip title={lang("l-search")}>
                          <IconButton color="info" onClick={() => doSearch()}>
                            <SearchOutlined />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={lang("l-advance-search")}
                          onClick={() => setOpenFilter(true)}
                        >
                          <IconButton color="info">
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
            minHeight: "80vh",
          }}
        >
          {result.map((food, index) => {
            return (
              <FoodSearchItem
                item={food}
                key={index}
                onBeforeNavigate={() => backup()}
              />
            );
          })}
          {searching.isActice && (
            <>
              <FoodItemSkeleton />
            </>
          )}
          {isOut && (
            <OutSearchResult
              textLabel={lang("Bạn đã tìm kiếm hết")}
              chipLabel={lang("Thử lại")}
              onTryClick={() => tryDoSearchMore()}
            />
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
