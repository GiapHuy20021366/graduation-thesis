import React from "react";
import { Box, BoxProps, Tab, Tabs, Tooltip } from "@mui/material";
import {
  HomeOutlined,
  FoodBankOutlined,
  PeopleAltOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { Location } from "react-router";
import { ITabOption, useTabNavigate } from "../../../hooks";

const AppTab = {
  HOME: 0,
  FOOD: 1,
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
          <Tooltip title="Home" arrow>
            <Tab
              icon={<HomeOutlined />}
              label="Home"
              onClick={() => tabNavigate.setTab(AppTab.HOME)}
            />
          </Tooltip>
          <Tooltip title="Food around" arrow>
            <Tab
              icon={<FoodBankOutlined />}
              label="Food"
              onClick={() => tabNavigate.setTab(AppTab.FOOD)}
            />
          </Tooltip>
          <Tooltip title="People" arrow>
            <Tab
              icon={<PeopleAltOutlined />}
              label="People"
              onClick={() => tabNavigate.setTab(AppTab.PEOPLE_AROUND)}
            />
          </Tooltip>
          <Tooltip title="Place" arrow>
            <Tab
              icon={<PlaceOutlined />}
              aria-label="Place"
              label="Place"
              onClick={() => tabNavigate.setTab(AppTab.PLACE)}
            />
          </Tooltip>
        </Tabs>
      </Box>
    );
  }
);

export default AppTabs;
