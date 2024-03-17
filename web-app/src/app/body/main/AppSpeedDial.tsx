import {
  AddCircleOutlined,
  ForumOutlined,
  HomeOutlined,
  ListAltOutlined,
  MessageOutlined,
  StarOutlined,
} from "@mui/icons-material";
import {
  SpeedDial,
  SpeedDialAction,
  SxProps,
  Theme,
  Tooltip,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router";

interface IAppSpeedDialProps {
  sx?: SxProps<Theme>;
}

export default function AppSpeedDial({ sx }: IAppSpeedDialProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState<boolean>(true);
  return (
    <SpeedDial
      sx={{
        position: "sticky",
        top: "16px",
        marginLeft: "16px",
        ...sx,
        height: "80vh",
        ":hover": {
          overflowY: open ? "auto" : "hidden",
        },
      }}
      icon={
        <Tooltip arrow title="Click to open" placement="right-end">
          <StarOutlined
            sx={{
              width: "70%",
              height: "70%",
              color: open ? "yellow" : "white",
            }}
          />
        </Tooltip>
      }
      ariaLabel={"Quickly"}
      open={open}
      direction="down"
      onClick={() => setOpen(!open)}
    >
      <SpeedDialAction icon={<HomeOutlined />} tooltipTitle={"Home"} />
      <SpeedDialAction icon={<ListAltOutlined />} tooltipTitle={"Target"} />
      <SpeedDialAction
        icon={
          <AddCircleOutlined
            sx={{
              color: "green",
            }}
          />
        }
        tooltipTitle={"Add"}
        onClick={() => navigate("/food/sharing")}
      />
      <SpeedDialAction icon={<ForumOutlined />} tooltipTitle={"Forum"} />
      <SpeedDialAction icon={<MessageOutlined />} tooltipTitle={"Message"} />
    </SpeedDial>
  );
}
