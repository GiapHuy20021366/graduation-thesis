import { Box, SpeedDial, Stack, Tab, Tabs, Tooltip } from "@mui/material";
import {
  ITabOption,
  applicationPages,
  useI18nContext,
  useTabNavigate,
} from "../../../hooks";
import {
  AddOutlined,
  FavoriteOutlined,
  HomeOutlined,
  PeopleAltOutlined,
  PlaceOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import MyFood from "./MyFood";
import NearFood from "./NearFood";
import LovedFood from "./LovedFood";
import StyledLink from "../../common/navigate/StyledLink";

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
  const lang = i18nContext.of("FoodList");

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
    <Box width={"100%"} boxSizing={"border-box"}>
      <Stack
        width="100%"
        direction={"row"}
        position={"sticky"}
        top={0}
        zIndex={1000}
        boxShadow={1}
        sx={{
          backgroundColor: "background.default",
        }}
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
          textColor="inherit"
        >
          <Tab
            label={lang("my-label")}
            onClick={onTabMyFoodClick}
            icon={<HomeOutlined />}
            iconPosition="start"
            sx={{
              color: "primary.main",
            }}
          />
          <Tab
            label={lang("near-label")}
            icon={<PeopleAltOutlined />}
            iconPosition="start"
            onClick={onTabNearFoodClick}
            sx={{
              color: "primary.main",
            }}
          />
          <Tab
            label={lang("loved-label")}
            icon={<FavoriteOutlined />}
            iconPosition="start"
            onClick={onTabLovedFoodClick}
            sx={{
              color: "secondary.main",
            }}
          />
        </Tabs>
      </Stack>

      {/* Tab contents */}
      <MyFood active={tab === FoodPageTab.MY_FOOD} />
      <NearFood active={tab === FoodPageTab.NEAR_FOOD} />
      <LovedFood active={tab === FoodPageTab.LOVED_FOOD} />

      <StyledLink to={applicationPages.FOOD_SHARING}>
        <Tooltip
          arrow
          children={
            <SpeedDial
              icon={<AddOutlined />}
              ariaLabel={"search"}
              sx={{ position: "fixed", bottom: 196, right: 26 }}
            />
          }
          title={lang("sharing-label")}
          placement="left"
        />
      </StyledLink>
      <StyledLink to={applicationPages.FOOD_AROUND}>
        <Tooltip
          arrow
          children={
            <SpeedDial
              icon={<PlaceOutlined />}
              sx={{ position: "fixed", bottom: 136, right: 26 }}
              ariaLabel={lang("around-label")}
            />
          }
          title={lang("around-label")}
          placement="left"
        />
      </StyledLink>
      <StyledLink to={applicationPages.FOOD_SEARCH}>
        <Tooltip
          arrow
          children={
            <SpeedDial
              icon={<SearchOutlined />}
              ariaLabel={lang("search-label")}
              sx={{ position: "fixed", bottom: 76, right: 26 }}
            />
          }
          title={lang("search-label")}
          placement="left"
        />
      </StyledLink>
    </Box>
  );
}
