import { IconButton, Stack, SxProps, Theme, Tooltip } from "@mui/material";
import SideBarOpener from "../common/menu-side/SideBarOpener";
import { RoomOutlined, SearchOutlined } from "@mui/icons-material";
import { useNavigate } from "react-router";
import NotificationProvider from "./utils/notification/NotificationProvider";

export default function AppHeaderUtil() {
  const navigate = useNavigate();
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
      <Tooltip title={"Notification"} children={<NotificationProvider />} />
      <Tooltip title={"Location"}>
        <IconButton
          sx={{
            color: "black",
          }}
          onClick={() => navigate("/around/users")}
        >
          <RoomOutlined sx={iconStyle} />
        </IconButton>
      </Tooltip>
      <Tooltip title={"Search"}>
        <IconButton
          sx={{
            color: "black",
          }}
          onClick={() => navigate("/food/search")}
        >
          <SearchOutlined sx={iconStyle} />
        </IconButton>
      </Tooltip>
    </Stack>
  );
}
