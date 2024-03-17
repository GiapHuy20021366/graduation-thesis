import { MenuOutlined, MenuOpen } from "@mui/icons-material";
import { useAppContentContext } from "../../../hooks";
import { IconButton, Tooltip } from "@mui/material";

export default function SideBarOpener() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  return (
    <Tooltip arrow title={`${isActive ? "Close" : "Open"} Menu`}>
      <IconButton
        sx={{
          color: "black",
        }}
        onClick={() => appContentContext.setMenuSideActive(!isActive)}
      >
        {isActive ? (
          <MenuOpen
            sx={{
              width: "1.3em",
              height: "1.3em",
            }}
          />
        ) : (
          <MenuOutlined
            sx={{
              width: "1.3em",
              height: "1.3em",
            }}
          />
        )}
      </IconButton>
    </Tooltip>
  );
}
