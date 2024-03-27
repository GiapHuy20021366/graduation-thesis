import { SpeedDial, Stack, Tab, Tabs } from "@mui/material";
import { ITabOption, useI18nContext, useTabNavigate } from "../../../hooks";
import {
  FavoriteOutlined,
  GradeOutlined,
  HomeOutlined,
  NotificationsActiveOutlined,
  PeopleAltOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import MyPlace from "./MyPlace";
import NearPlace from "./NearPlace";
import FavoritePlace from "./FavoritePlace";
import SubcribedPlace from "./SubcribedPlace";
import RatingPlace from "./RatedPlace";
import { useNavigate } from "react-router";

const PlacePageTab = {
  MY_PLACE: 0,
  NEAR_HERE: 1,
  FAVORITE: 2,
  SUBCRIBED: 3,
  RATING: 4,
} as const;

type PlacePageTab = (typeof PlacePageTab)[keyof typeof PlacePageTab];

const tabs: ITabOption[] = [
  {
    query: "myplace",
    value: PlacePageTab.MY_PLACE,
  },
  {
    query: "nearplace",
    value: PlacePageTab.NEAR_HERE,
  },
  {
    query: "favorite",
    value: PlacePageTab.FAVORITE,
  },
  {
    query: "subcribed",
    value: PlacePageTab.SUBCRIBED,
  },
  {
    query: "rating",
    value: PlacePageTab.RATING,
  },
];

export default function PlaceList() {
  const tabNavigate = useTabNavigate({ tabOptions: tabs });
  const tab = tabNavigate.tab;
  const navigate = useNavigate();

  const i18nContext = useI18nContext();
  const lang = i18nContext.of(PlaceList);

  const onTabMyPlaceClick = () => {
    //
  };

  const onTabNearPlaceClick = () => {
    //
  };

  const onTabFavoriteClick = () => {
    //
  };

  const onTabViewClick = () => {
    //
  };

  const handleTabChange = (
    _event: React.SyntheticEvent<Element, Event>,
    value: any
  ) => {
    tabNavigate.setTab(value);
  };

  return (
    <Stack width={"100%"} boxSizing={"border-box"} height={"100%"}>
      <Stack
        width="100%"
        direction={"row"}
        position={"sticky"}
        top={0}
        boxShadow={1}
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
          textColor="inherit"
        >
          <Tab
            label={lang("Của tôi")}
            onClick={onTabMyPlaceClick}
            icon={<HomeOutlined />}
            iconPosition="start"
          />
          <Tab
            label={lang("Gần đây")}
            icon={<PeopleAltOutlined />}
            iconPosition="start"
            onClick={onTabNearPlaceClick}
          />
          <Tab
            label={lang("Được yêu thích")}
            icon={<FavoriteOutlined />}
            iconPosition="start"
            onClick={onTabFavoriteClick}
          />
          <Tab
            label={lang("Đã theo dõi")}
            icon={<NotificationsActiveOutlined />}
            iconPosition="start"
            onClick={onTabViewClick}
          />
          <Tab
            label={lang("Đã đánh giá")}
            icon={<GradeOutlined />}
            iconPosition="start"
            onClick={onTabViewClick}
          />
        </Tabs>
      </Stack>

      {/* Tab contents */}
      <MyPlace
        active={tab === PlacePageTab.MY_PLACE}
        sx={{
          minHeight: "100%",
        }}
      />
      <NearPlace active={tab === PlacePageTab.NEAR_HERE} />
      <FavoritePlace active={tab === PlacePageTab.FAVORITE} />
      <SubcribedPlace active={tab === PlacePageTab.SUBCRIBED} />
      <RatingPlace active={tab === PlacePageTab.RATING} />

      <SpeedDial
        icon={<SearchOutlined />}
        ariaLabel={"search"}
        sx={{ position: "absolute", bottom: 76, right: 26 }}
        onClick={() => navigate("/place/search")}
      />
    </Stack>
  );
}
