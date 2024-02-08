import React from "react";
import { Box, BoxProps, Tab, Tabs } from "@mui/material";
import {
  HomeOutlined,
  FoodBankOutlined,
  PeopleAltOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Location } from "react-router";
import { ITabOption, useTabNavigate } from "../../hooks";

const AppTab = {
  HOME: 0,
  FOOD_AROUND: 1,
  PEOPLE_AROUND: 2,
  PLACE: 3,
} as const;

type AppTab = (typeof AppTab)[keyof typeof AppTab];

type NearPlaceProps = BoxProps;

const appTabs: ITabOption[] = [
  {
    value: AppTab.HOME,
    url: "/home",
  },
  {
    url: "/around/food",
    value: AppTab.FOOD_AROUND,
  },
  {
    url: "/around/users",
    value: AppTab.PEOPLE_AROUND,
  },
  {
    url: "/place",
    value: AppTab.PLACE,
  },
];

const appTabResolver = (location: Location<any>): number => {
  const pathname = location.pathname;
  if (pathname.includes("/around/users")) return AppTab.PEOPLE_AROUND;
  if (pathname.includes("/around/food")) return AppTab.FOOD_AROUND;
  if (pathname.includes("/place")) return AppTab.PLACE;
  return AppTab.HOME;
};

const AppTabs = React.forwardRef<HTMLDivElement, NearPlaceProps>(
  (props, ref) => {
    const tabNavigate = useTabNavigate({
      tabOptions: appTabs,
      resolver: appTabResolver,
    });

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
          <Tab
            icon={<HomeOutlined />}
            aria-label="Home"
            label="Home"
            onClick={() => tabNavigate.setTab(AppTab.HOME)}
          />
          <Tab
            icon={<FoodBankOutlined />}
            aria-label="Food around"
            label="Food"
            onClick={() => tabNavigate.setTab(AppTab.FOOD_AROUND)}
          />
          <Tab
            icon={<PeopleAltOutlined />}
            aria-label="People"
            label="People"
            onClick={() => tabNavigate.setTab(AppTab.PEOPLE_AROUND)}
          />
          <Tab
            icon={<PlaceOutlined />}
            aria-label="Place"
            label="Place"
            onClick={() => tabNavigate.setTab(AppTab.PLACE)}
          />
        </Tabs>
      </Box>
    );
  }
);

export default AppTabs;
