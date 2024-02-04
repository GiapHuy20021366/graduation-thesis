import React, { useEffect } from "react";
import { Box, BoxProps, Tab, Tabs } from "@mui/material";
import {
  HomeOutlined,
  FoodBankOutlined,
  PeopleAltOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import { useLocation, useNavigate } from "react-router";

const AppTab = {
  HOME: 0,
  FOOD_AROUND: 1,
  PEOPLE_AROUND: 2,
  PLACE: 3,
} as const;

type AppTab = (typeof AppTab)[keyof typeof AppTab];

type NearPlaceProps = BoxProps;

const toAppTab = (pathname: string): AppTab => {
  if (pathname.includes("/around/users")) return AppTab.PEOPLE_AROUND;
  if (pathname.includes("/around/food")) return AppTab.FOOD_AROUND;
  if (pathname.includes("/place")) return AppTab.PLACE;
  return AppTab.HOME;
};

const AppTabs = React.forwardRef<HTMLDivElement, NearPlaceProps>(
  (props, ref) => {
    const [value, setValue] = React.useState<AppTab>(0);
    const navigate = useNavigate();

    const location = useLocation();
    useEffect(() => {
      const tab = toAppTab(location.pathname);
      setValue(tab);
    }, [location]);

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
          value={value}
          variant="scrollable"
          scrollButtons
          allowScrollButtonsMobile
        >
          <Tab
            icon={<HomeOutlined />}
            aria-label="Home"
            label="Home"
            onClick={() => navigate("/home")}
          />
          <Tab
            icon={<FoodBankOutlined />}
            aria-label="Food around"
            label="Food"
            onClick={() => navigate("/around/food")}
          />
          <Tab
            icon={<PeopleAltOutlined />}
            aria-label="People"
            label="People"
            onClick={() => navigate("/around/users")}
          />
          <Tab
            icon={<PlaceOutlined />}
            aria-label="Place"
            label="Place"
            onClick={() => navigate("/place")}
          />
        </Tabs>
      </Box>
    );
  }
);

export default AppTabs;
