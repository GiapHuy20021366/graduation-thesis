import React from "react";
import { Tab, Tabs, TabsProps, Tooltip } from "@mui/material";
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

type AppTabsProps = TabsProps;

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
    <Tabs
      ref={ref}
      value={tabNavigate.tab}
      variant="scrollable"
      scrollButtons
      allowScrollButtonsMobile
      textColor="inherit"
      TabIndicatorProps={{
        style: {
          backgroundColor: "#D97D54",
          height: "0.2em",
        },
      }}
      {...props}
    >
      <Tooltip title={lang("home-title")} arrow>
        <Tab
          icon={<HomeOutlined sx={{ width: "1.5em", height: "1.5em" }} />}
          // label={lang("home-label")}
          onClick={() => tabNavigate.setTab(AppTab.HOME)}
        />
      </Tooltip>
      <Tooltip title={lang("food-around-title")} arrow>
        <Tab
          icon={<FoodBankOutlined sx={{ width: "1.5em", height: "1.5em" }} />}
          // label={lang("food-around-label")}
          onClick={() => tabNavigate.setTab(AppTab.FOOD)}
        />
      </Tooltip>
      <Tooltip title={lang("people-title")} arrow>
        <Tab
          icon={<PeopleAltOutlined sx={{ width: "1.5em", height: "1.5em" }} />}
          // label={lang("people-label")}
          onClick={() => tabNavigate.setTab(AppTab.PEOPLE_AROUND)}
        />
      </Tooltip>
      <Tooltip title={lang("place-title")} arrow>
        <Tab
          icon={<PlaceOutlined sx={{ width: "1.5em", height: "1.5em" }} />}
          // label={lang("place-label")}
          onClick={() => tabNavigate.setTab(AppTab.PLACE)}
        />
      </Tooltip>
    </Tabs>
  );
});

export default AppTabs;
