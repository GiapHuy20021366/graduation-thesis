import { MenuOutlined, MenuOpen } from "@mui/icons-material";
import { useAppContentContext } from "../../../hooks";

export default function SideBarOpener() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  return (
    <>
      {isActive ? (
        <MenuOpen
          onClick={() => appContentContext.setMenuSideActive(false)}
          sx={{
            width: "1.3em",
            height: "1.3em",
            cursor: "pointer",
          }}
        />
      ) : (
        <MenuOutlined
          onClick={() => appContentContext.setMenuSideActive(true)}
          sx={{
            width: "1.3em",
            height: "1.3em",
            cursor: "pointer",
          }}
        />
      )}
    </>
  );
}
