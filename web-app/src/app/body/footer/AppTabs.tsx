import React from "react";
import { Tab, Tabs, TabsProps, Tooltip } from "@mui/material";
import {
  HomeOutlined,
  FoodBankOutlined,
  PeopleAltOutlined,
  PlaceOutlined,
} from "@mui/icons-material";
import {
  ApplicationPage,
  applicationPages,
  useComponentLanguage,
  usePageResolver,
} from "../../../hooks";
import StyledLink from "../../common/navigate/StyledLink";

type AppTabsProps = TabsProps;

const tabs: ApplicationPage[] = [
  applicationPages.HOME,
  applicationPages.FOOD,
  applicationPages.USER_AROUND,
  applicationPages.PLACE,
] as const;

const AppTabs = React.forwardRef<HTMLDivElement, AppTabsProps>((props, ref) => {
  const lang = useComponentLanguage("AppTabs");
  const page = usePageResolver();

  const pageIndex = Math.max(0, tabs.indexOf(page.page));

  return (
    <Tabs
      ref={ref}
      value={pageIndex}
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
        <StyledLink to={applicationPages.HOME}>
          <Tab
            icon={<HomeOutlined sx={{ width: "1.8em", height: "1.8em" }} />}
          />
        </StyledLink>
      </Tooltip>
      <Tooltip title={lang("food-title")} arrow>
        <StyledLink to={applicationPages.FOOD}>
          <Tab
            icon={<FoodBankOutlined sx={{ width: "1.8em", height: "1.8em" }} />}
          />
        </StyledLink>
      </Tooltip>
      <Tooltip title={lang("people-title")} arrow>
        <StyledLink to={applicationPages.USER_AROUND}>
          <Tab
            icon={
              <PeopleAltOutlined sx={{ width: "1.8em", height: "1.8em" }} />
            }
          />
        </StyledLink>
      </Tooltip>
      <Tooltip title={lang("place-title")} arrow>
        <StyledLink to={applicationPages.PLACE}>
          <Tab
            icon={<PlaceOutlined sx={{ width: "1.8em", height: "1.8em" }} />}
          />
        </StyledLink>
      </Tooltip>
    </Tabs>
  );
});

export default AppTabs;
