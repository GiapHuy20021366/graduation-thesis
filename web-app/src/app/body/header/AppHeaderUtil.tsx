import { IconButton, Stack, SxProps, Theme, Tooltip } from "@mui/material";
import SideBarOpener from "../../common/menu-side/SideBarOpener";
import {
  BookmarkAddOutlined,
  RoomOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";
// import NotificationProvider from "./utils/notification/NotificationProvider";

export default function AppHeaderUtil() {
  const iconStyle: SxProps<Theme> = {
    width: "1.3em",
    height: "1.3em",
    cursor: "pointer",
    ":hover": {
      color: "gray",
    },
  };
  return (
    <Stack
      direction={"row"}
      sx={{
        alignItems: "center",
        pt: 1,
      }}
    >
      <SideBarOpener />
      <Tooltip arrow title={"Add food"}>
        <StyledLink to={"/food/sharing"}>
          <IconButton
            sx={{
              color: "black",
            }}
          >
            <BookmarkAddOutlined sx={iconStyle} />
          </IconButton>
        </StyledLink>
      </Tooltip>
      <Tooltip arrow title={"Location"}>
        <StyledLink to={"/user/around"}>
          <IconButton
            sx={{
              color: "black",
            }}
          >
            <RoomOutlined sx={iconStyle} />
          </IconButton>
        </StyledLink>
      </Tooltip>
      <Tooltip arrow title={"Search"}>
        <StyledLink to={"/food/search"}>
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
