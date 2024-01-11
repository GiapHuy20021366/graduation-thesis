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
import { useEffect, useRef, useState } from "react";
import { IFoodSearchInfo, OrderState, toNextOrderState } from "../../../data";
import FoodSearchItem from "./FoodSearchItem";
import { IFoodSeachOrder, IFoodSearchParams, foodFetcher } from "../../../api";
import FoodSearchFilter from "./FoodSearchCondition";
import { useAuthContext, useFoodSearchContext } from "../../../hooks";

interface IOrderIconProps {
  order?: OrderState;
}

function OrderIcon({ order }: IOrderIconProps) {
  if (order === OrderState.INCREASE) return <ArrowDownward />;
  if (order === OrderState.DECREASE) return <ArrowUpward />;
  if (order === OrderState.NONE) return <ImportExport />;
  return <></>;
}

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
  const [tab, setTab] = useState<number>(0);

  const searchContext = useFoodSearchContext();
  const {
    query,
    setQuery,
    setOrderDistance,
    setOrderPrice,
    setOrderNew,
    setOrderQuantity,
    categories,
    maxDistance,
    maxDuration,
    minQuantity,
    price,
    order,
  } = searchContext;

  const { orderDistance, orderNew, orderPrice, orderQuantity } = order;

  const authContext = useAuthContext();
  const auth = authContext.auth;

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
    if (auth != null) {
      foodFetcher.searchFood(params, auth).then((data) => {
        setResult(data.data ?? []);
      });
    }
  };

  const doSearch = () => {
    searchFood(searchContext);
  };

  const handleSearchQueryChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: string | null
  ): void => {
    setQuery(value ?? "");
    if (value) {
      searchFood({ ...searchContext, query: value });
    }
  };

  const onTabRelativeClick = () => {
    if (tab === 0) return;
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: OrderState.NONE,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = {
      order,
      categories,
      maxDistance,
      maxDuration,
      minQuantity,
      price,
      query,
    };
    console.log(searchParams);
  };

  const onTabOrderNewClick = () => {
    const newOrder = tab === 1 ? toNextOrderState(orderNew) : orderNew;
    setOrderNew(newOrder);
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: newOrder,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = {
      order,
      categories,
      maxDistance,
      maxDuration,
      minQuantity,
      price,
      query,
    };
    console.log(searchParams);
  };

  const onTabOrderDistanceClick = () => {
    const distanceOrder =
      tab === 2 ? toNextOrderState(orderDistance) : orderDistance;
    setOrderDistance(distanceOrder);
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: distanceOrder,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = {
      order,
      categories,
      maxDistance,
      maxDuration,
      minQuantity,
      price,
      query,
    };
    console.log(searchParams);
  };

  const onTabOrderPriceClick = () => {
    const priceOrder = tab === 3 ? toNextOrderState(orderPrice) : orderPrice;
    setOrderPrice(priceOrder);
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: priceOrder,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = {
      order,
      categories,
      maxDistance,
      maxDuration,
      minQuantity,
      price,
      query,
    };
    console.log(searchParams);
  };

  const onTabOrderQuantityClick = () => {
    const quantityOrder =
      tab === 4 ? toNextOrderState(orderQuantity) : orderQuantity;
    setOrderQuantity(quantityOrder);
    const order: IFoodSeachOrder = {
      orderDistance: OrderState.NONE,
      orderNew: quantityOrder,
      orderPrice: OrderState.NONE,
      orderQuantity: OrderState.NONE,
    };
    const searchParams: IFoodSearchParams = {
      order,
      categories,
      maxDistance,
      maxDuration,
      minQuantity,
      price,
      query,
    };
    console.log(searchParams);
  };

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
      />
      <Stack
        flex={1}
        sx={{
          overflowY: "auto",
        }}
      >
        {result.map((food, index) => {
          return <FoodSearchItem item={food} key={index} />;
        })}
      </Stack>
    </Stack>
  );
}
