import { IconButton, Stack, StackProps, Tooltip } from "@mui/material";
import SideBarOpener from "../../common/menu-side/SideBarOpener";
import {
  BookmarkAddOutlined,
  MarkChatUnreadOutlined,
  SearchOutlined,
} from "@mui/icons-material";
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
        <StyledLink to={applicationPages.FOOD_SHARING}>
          <Tooltip arrow title={lang("add-food-title")}>
            <IconButton color="inherit">
              <BookmarkAddOutlined sx={{ width: "1.3em", height: "1.3em" }} />
            </IconButton>
          </Tooltip>
        </StyledLink>
        <Tooltip arrow title={lang("notification-title")}>
          <NotificationButtonAction
            color="inherit"
            IconPropsSx={{ width: "1.3em", height: "1.3em" }}
          />
        </Tooltip>
        <StyledLink to={applicationPages.FOOD_SEARCH}>
          <Tooltip arrow title={lang("search-food-title")}>
            <IconButton color="inherit">
              <SearchOutlined sx={{ width: "1.3em", height: "1.3em" }} />
            </IconButton>
          </Tooltip>
        </StyledLink>
        <StyledLink to={applicationPages.CONVERSATION}>
          <Tooltip arrow title={lang("conversation-title")}>
            <IconButton color="inherit">
              <MarkChatUnreadOutlined
                sx={{ width: "1.1em", height: "1.1em" }}
              />
            </IconButton>
          </Tooltip>
        </StyledLink>
      </Stack>
    );
  }
);

export default AppHeaderUtil;
