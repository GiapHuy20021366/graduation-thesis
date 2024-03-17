import { Box, SpeedDial, Stack, Tab, Tabs, Tooltip } from "@mui/material";
import { ITabOption, useI18nContext, useTabNavigate } from "../../../hooks";
import {
  FavoriteOutlined,
  HomeOutlined,
  PeopleAltOutlined,
  PlaceOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import MyFood from "./MyFood";
import NearFood from "./NearFood";
import LovedFood from "./LovedFood";
import { useNavigate } from "react-router";

const FoodPageTab = {
  MY_FOOD: 0,
  NEAR_FOOD: 1,
  LOVED_FOOD: 2,
} as const;

type FoodPageTab = (typeof FoodPageTab)[keyof typeof FoodPageTab];

const tabs: ITabOption[] = [
  {
    query: "myfood",
    value: FoodPageTab.MY_FOOD,
  },
  {
    query: "nearfood",
    value: FoodPageTab.NEAR_FOOD,
  },
  {
    query: "lovedfood",
    value: FoodPageTab.LOVED_FOOD,
  },
];

export default function FoodList() {
  const tabNavigate = useTabNavigate({ tabOptions: tabs });
  const tab = tabNavigate.tab;

  const i18nContext = useI18nContext();
  const lang = i18nContext.of(FoodList);

  const navigate = useNavigate();

  const onTabMyFoodClick = () => {
    //
  };

  const onTabNearFoodClick = () => {
    //
  };

  const onTabLovedFoodClick = () => {
    //
  };

  const handleTabChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    tabNavigate.setTab(value);
  };

  return (
    <Box
      width={"100%"}
      boxSizing={"border-box"}
      boxShadow={1}
      // position={"relative"}
    >
      <Stack
        width="100%"
        direction={"row"}
        position={"sticky"}
        top={0}
        sx={{ backgroundColor: "white" }}
        zIndex={1000}
      >
        <Tabs
          value={tabNavigate.tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            ".MuiTab-root": {
              textTransform: "initial",
            },
          }}
        >
          <Tab
            label={lang("Của tôi")}
            onClick={onTabMyFoodClick}
            icon={<HomeOutlined />}
            iconPosition="start"
          />
          <Tab
            label={lang("Gần đây")}
            icon={<PeopleAltOutlined />}
            iconPosition="start"
            onClick={onTabNearFoodClick}
          />
          <Tab
            label={lang("Đã yêu thích")}
            icon={<FavoriteOutlined />}
            iconPosition="start"
            onClick={onTabLovedFoodClick}
          />
        </Tabs>
      </Stack>

      {/* Tab contents */}
      <MyFood active={tab === FoodPageTab.MY_FOOD} />
      <NearFood active={tab === FoodPageTab.NEAR_FOOD} />
      <LovedFood active={tab === FoodPageTab.LOVED_FOOD} />

      <Tooltip
        arrow
        children={
          <SpeedDial
            icon={<PlaceOutlined />}
            sx={{ position: "absolute", bottom: 136, right: 26 }}
            ariaLabel={"Around"}
            onClick={() => navigate("/food/around")}
          />
        }
        title="Thực phẩm xung quanh"
        placement="left"
      />
      <SpeedDial
        icon={<SearchOutlined />}
        ariaLabel={"search"}
        sx={{ position: "absolute", bottom: 76, right: 26 }}
        onClick={() => navigate("/food/search")}
      />
    </Box>
  );
}
