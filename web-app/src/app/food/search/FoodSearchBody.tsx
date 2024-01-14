import {
  ArrowDownward,
  ArrowUpward,
  ImportExport,
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
  useLoading,
} from "../../../hooks";
import { IFoodSearchContext } from "./FoodSearchContext";
import FoodItemSkeleton from "./FoodItemSkeleton";

interface IOrderIconProps {
  order?: OrderState;
}

function OrderIcon({ order }: IOrderIconProps) {
  if (order === OrderState.INCREASE) return <ArrowDownward />;
  if (order === OrderState.DECREASE) return <ArrowUpward />;
  if (order === OrderState.NONE) return <ImportExport />;
  return <></>;
}

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

export default function FoodSearchBody() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<IFoodSearchInfo[]>([]);
  const [openFilter, setOpenFilter] = useState<boolean>(false);
  const [options, setOptions] = useState<string[]>([
    "Option 1",
    "Option 2",
    "Option 3",
    "Option 4",
    "Option 5",
    "Option 6",
  ]);
  const [tab, setTab] = useState<SearchTab>(SearchTab.RELATED);

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

  const searchFood = (params: IFoodSearchParams) => {
    console.log(params);

    if (auth != null && params.query && !searching.isActice) {
      searching.active();
      setResult([]);
      foodFetcher
        .searchFood(params, auth)
        .then((data) => {
          setTimeout(() => {
            setResult(data.data ?? []);
            searching.deactive();
          }, 200);
        })
        .catch(() => {
          searching.deactive();
        });
    }
  };

  const doSearch = () => {
    searchFood(
      toSearchParams(searchContext, appContentContext.currentLocation)
    );
  };

  const handleSearchQueryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ): void => {
    setQuery(value ?? "");
    if (value) {
      searchFood(
        toSearchParams(
          { ...searchContext, query: value },
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
      orderDistance: OrderState.NONE,
      orderNew: distanceOrder,
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
      orderNew: priceOrder,
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

  const onTabOrderQuantityClick = () => {
    const quantityOrder =
      tab === SearchTab.QUANTITY
        ? toNextOrderState(orderQuantity)
        : orderQuantity;
    setOrderQuantity(quantityOrder);
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: quantityOrder,
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
    };
    searchFood(searchParams);
  };

  const doSearchMore = useCallback(() => {
    const params = toSearchParams(
      searchContext,
      appContentContext.currentLocation
    );
    params.pagination = {
      skip: result.length,
      limit: 24,
    };
    if (auth != null && searchContext.query && !searching.isActice) {
      searching.active();
      foodFetcher
        .searchFood(params, auth)
        .then((data) => {
          setTimeout(() => {
            const datas = data.data ?? [];
            const newData = [...result, ...datas];
            setResult(newData);
            searching.deactive();
          }, 1000);
        })
        .catch(() => {
          searching.deactive();
        });
    }
  }, [
    appContentContext.currentLocation,
    auth,
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

  return (
    <Stack height="100%" width="100%" direction="column">
      <Box
        sx={{
          position: "sticky",
          top: 0,
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
          onInputChange={handleInputChange}
          onChange={handleSearchQueryChange}
          sx={{
            width: ["100%", "90%", "80%"],
          }}
          renderOption={(props, option) => (
            <ListItem disablePadding {...props}>
              <ListItemIcon>
                <SearchOutlined />
              </ListItemIcon>
              <ListItemText primary={option} />
            </ListItem>
          )}
          renderInput={(params) => (
            <TextField
              inputRef={inputRef}
              {...params}
              margin="normal"
              variant="outlined"
              placeholder="Search your food"
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
                      <Tooltip title={"Search"}>
                        <IconButton color="info" onClick={() => doSearch()}>
                          <SearchOutlined />
                        </IconButton>
                      </Tooltip>
                      <Tooltip
                        title={"Advantage search"}
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
            <Tab label="Liên quan" onClick={onTabRelativeClick} />
            <Tab
              label="Thời điểm"
              icon={<OrderIcon order={orderNew} />}
              iconPosition="end"
              onClick={onTabOrderNewClick}
            />
            <Tab
              label="Khoảng cách"
              icon={<OrderIcon order={orderDistance} />}
              iconPosition="end"
              onClick={onTabOrderDistanceClick}
            />
            <Tab
              label="Giá"
              icon={<OrderIcon order={orderPrice} />}
              iconPosition="end"
              onClick={onTabOrderPriceClick}
            />
            <Tab
              label="Chất lượng"
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
          return <FoodSearchItem item={food} key={index} />;
        })}
        {searching.isActice && (
          <>
            <FoodItemSkeleton />
            <FoodItemSkeleton />
          </>
        )}
      </Stack>
    </Stack>
  );
}
