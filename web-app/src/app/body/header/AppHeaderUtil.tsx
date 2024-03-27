import { IconButton, Stack, StackProps, Tooltip } from "@mui/material";
import SideBarOpener from "../../common/menu-side/SideBarOpener";
import { BookmarkAddOutlined, SearchOutlined } from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";
import NotificationButtonAction from "./utils/notification/NotificationButtonAction";
import { applicationPages, useComponentLanguage } from "../../../hooks";
import React from "react";

type AppHeaderUtilProps = StackProps;

const AppHeaderUtil = React.forwardRef<HTMLDivElement, AppHeaderUtilProps>(
  (props, ref) => {
    const lang = useComponentLanguage("AppHeaderUtil");
    return (
      <Stack
        ref={ref}
        direction={"row"}
        {...props}
        sx={{
          alignItems: "center",
          ...(props.sx ?? {}),
        }}
      >
        <SideBarOpener
          color="inherit"
          IconPropsSx={{ width: "1.3em", height: "1.3em" }}
        />
        <Tooltip arrow title={lang("add-food-title")}>
          <StyledLink to={applicationPages.FOOD_SHARING}>
            <IconButton color="inherit">
              <BookmarkAddOutlined sx={{ width: "1.3em", height: "1.3em" }} />
            </IconButton>
          </StyledLink>
        </Tooltip>
        <Tooltip arrow title={lang("notification-title")}>
          <NotificationButtonAction
            color="inherit"
            IconPropsSx={{ width: "1.3em", height: "1.3em" }}
          />
        </Tooltip>
        <Tooltip arrow title={lang("search-food-title")}>
          <StyledLink to={applicationPages.FOOD_SEARCH}>
            <IconButton color="inherit">
              <SearchOutlined sx={{ width: "1.3em", height: "1.3em" }} />
            </IconButton>
          </StyledLink>
        </Tooltip>
      </Stack>
    );
  }
);

export default AppHeaderUtil;
