import { MenuOutlined } from "@mui/icons-material";
import { useAppContentContext } from "../../contexts";

export default function SideBarOpener() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  return (
    <MenuOutlined
      onClick={() => appContentContext.setMenuSideActive(!isActive)}
      sx={{
        width: "1.5em",
        height: "1.5em",
        cursor: "pointer"
      }}
    >
      Toggle Sidebar
    </MenuOutlined>
  );
}
