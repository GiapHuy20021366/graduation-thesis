import React from "react";
import { Box, BoxProps, Tab, Tabs, Tooltip } from "@mui/material";
import {
  HomeOutlined,
  FoodBankOutlined,
  PeopleAltOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Location } from "react-router";
import {
  ITabOption,
  useComponentLanguage,
  useTabNavigate,
} from "../../../hooks";

const AppTab = {
  HOME: 0,
  FOOD: 1,
  PEOPLE_AROUND: 2,
  PLACE: 3,
} as const;

type AppTab = (typeof AppTab)[keyof typeof AppTab];

type AppTabsProps = BoxProps;

const appTabs: ITabOption[] = [
  {
    value: AppTab.HOME,
    url: "/home",
  },
  {
    url: "/food",
    value: AppTab.FOOD,
  },
  {
    url: "/user/around",
    value: AppTab.PEOPLE_AROUND,
  },
  {
    url: "/place",
    value: AppTab.PLACE,
  },
];

const appTabResolver = (location: Location<any>): number => {
  const pathname = location.pathname;
  if (pathname.includes("/user/around")) return AppTab.PEOPLE_AROUND;
  if (pathname.includes("/food")) return AppTab.FOOD;
  if (pathname.includes("/place")) return AppTab.PLACE;
  return AppTab.HOME;
};

const AppTabs = React.forwardRef<HTMLDivElement, AppTabsProps>((props, ref) => {
  const tabNavigate = useTabNavigate({
    tabOptions: appTabs,
    resolver: appTabResolver,
  });

  const lang = useComponentLanguage("AppTabs");

  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <Tabs
        value={tabNavigate.tab}
        variant="scrollable"
        scrollButtons
        allowScrollButtonsMobile
      >
        <Tooltip title={lang("home-title")} arrow>
          <Tab
            icon={<HomeOutlined />}
            label={lang("home-label")}
            onClick={() => tabNavigate.setTab(AppTab.HOME)}
          />
        </Tooltip>
        <Tooltip title={lang("food-around-title")} arrow>
          <Tab
            icon={<FoodBankOutlined />}
            label={lang("food-around-label")}
            onClick={() => tabNavigate.setTab(AppTab.FOOD)}
          />
        </Tooltip>
        <Tooltip title={lang("people-title")} arrow>
          <Tab
            icon={<PeopleAltOutlined />}
            label={lang("people-label")}
            onClick={() => tabNavigate.setTab(AppTab.PEOPLE_AROUND)}
          />
        </Tooltip>
        <Tooltip title={lang("place-title")} arrow>
          <Tab
            icon={<PlaceOutlined />}
            label={lang("place-label")}
            onClick={() => tabNavigate.setTab(AppTab.PLACE)}
          />
        </Tooltip>
      </Tabs>
    </Box>
  );
});

export default AppTabs;
