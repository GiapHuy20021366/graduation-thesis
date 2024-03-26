import { MenuOutlined, MenuOpen } from "@mui/icons-material";
import { useAppContentContext, useComponentLanguage } from "../../../hooks";
import { IconButton, Tooltip } from "@mui/material";

export default function SideBarOpener() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  const lang = useComponentLanguage("SideBarOpener");
  return (
    <Tooltip
      arrow
      title={`${isActive ? lang("close-title") : lang("open-title")}`}
    >
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
