import { Badge, IconButton, Stack, SxProps, Theme, Tooltip } from "@mui/material";
import SideBarOpener from "../common/menu-side/SideBarOpener";
import {
  NotificationsOutlined,
  RoomOutlined,
  SearchOutlined,
} from "@mui/icons-material";
import { useNavigate } from "react-router";

export default function AppHeaderUntil() {
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
        pt: 1
      }}
    >
      <SideBarOpener />
      <Tooltip title={"Notification"}>
        <IconButton
          sx={{
            color: "black",
          }}
        >
          <Badge
            badgeContent={4}
            anchorOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
            color="secondary"
          >
            <NotificationsOutlined sx={iconStyle} />
          </Badge>
        </IconButton>
      </Tooltip>
      <Tooltip title={"Location"}>
        <IconButton
          sx={{
            color: "black",
          }}
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
