import { Box, SpeedDial, Stack, Tab, Tabs } from "@mui/material";
import { useState } from "react";
import { useI18nContext } from "../../../hooks";
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
import SubcribedPlace from "./SubcribePlace";
import RatingPlace from "./RatingPlace";

const PlacePageTab = {
  MY_PLACE: 0,
  NEAR_HERE: 1,
  FAVORITE: 2,
  SUBCRIBED: 3,
  RATING: 4,
} as const;

type PlacePageTab = (typeof PlacePageTab)[keyof typeof PlacePageTab];

export default function PlaceList() {
  const [tab, setTab] = useState<PlacePageTab>(PlacePageTab.MY_PLACE);

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

  return (
    <Box width={"100%"} boxSizing={"border-box"} boxShadow={1}>
      <Stack
        width="100%"
        direction={"row"}
        position={"sticky"}
        top={0}
        sx={{ backgroundColor: "white" }}
        zIndex={1000}
      >
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
      <MyPlace display={tab === PlacePageTab.MY_PLACE ? "block" : "none"} />
      <NearPlace display={tab === PlacePageTab.NEAR_HERE ? "block" : "none"} />
      <FavoritePlace
        display={tab === PlacePageTab.FAVORITE ? "block" : "none"}
      />
      <SubcribedPlace
        display={tab === PlacePageTab.SUBCRIBED ? "block" : "none"}
      />
      <RatingPlace display={tab === PlacePageTab.RATING ? "block" : "none"} />

      <SpeedDial
        icon={<SearchOutlined />}
        ariaLabel={"search"}
        sx={{ position: "absolute", bottom: 76, right: 26 }}
      />
    </Box>
  );
}
