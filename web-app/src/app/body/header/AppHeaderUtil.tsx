import { IconButton, Stack, SxProps, Theme, Tooltip } from "@mui/material";
import SideBarOpener from "../../common/menu-side/SideBarOpener";
import {
  BookmarkAddOutlined,
  // RoomOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";
import NotificationButtonAction from "./utils/notification/NotificationButtonAction";
import { applicationPages, useComponentLanguage } from "../../../hooks";

export default function AppHeaderUtil() {
  const iconStyle: SxProps<Theme> = {
    width: "1.3em",
    height: "1.3em",
    cursor: "pointer",
    ":hover": {
      color: "gray",
    },
  };

  const lang = useComponentLanguage("AppHeaderUtil");
  return (
    <Stack
      direction={"row"}
      sx={{
        alignItems: "center",
        pt: 1,
      }}
    >
      <SideBarOpener />
      <Tooltip arrow title={lang("add-food-title")}>
        <StyledLink to={applicationPages.FOOD_SHARING}>
          <IconButton
            sx={{
              color: "black",
            }}
          >
            <BookmarkAddOutlined sx={iconStyle} />
          </IconButton>
        </StyledLink>
      </Tooltip>
      <Tooltip arrow title={lang("notification-title")}>
        <NotificationButtonAction />
      </Tooltip>
      {/* <Tooltip arrow title={lang("people-around-title")}>
        <StyledLink to={applicationPages.USER_AROUND}>
          <IconButton
            sx={{
              color: "black",
            }}
          >
            <RoomOutlined sx={iconStyle} />
          </IconButton>
        </StyledLink>
      </Tooltip> */}
      <Tooltip arrow title={lang("search-food-title")}>
        <StyledLink to={applicationPages.FOOD_SEARCH}>
          <IconButton
            sx={{
              color: "black",
            }}
          >
            <SearchOutlined sx={iconStyle} />
          </IconButton>
        </StyledLink>
      </Tooltip>
    </Stack>
  );
}
