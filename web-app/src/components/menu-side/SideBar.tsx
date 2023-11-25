import Drawer from "@mui/material/Drawer";
import { useAppContentContext, useAuthenticationContext } from "../../contexts";
import { Box, Container, Stack } from "@mui/material";
import {
  HomeOutlined,
  FaceRetouchingNaturalOutlined,
  SentimentSatisfiedAltOutlined,
  FolderSharedOutlined,
  RoomOutlined,
  HelpOutlineOutlined,
} from "@mui/icons-material";
import SideBarItemText from "./SideBarItemText";
import SideBarItem from "./SideBarItem";

export default function SideBar() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  const authContext = useAuthenticationContext();

  return (
    <Container>
      <Drawer
        anchor="left"
        open={isActive}
        onClose={() => appContentContext.setMenuSideActive(false)}
      >
        <Container
          sx={{
            width: ["70vw", "60vw", "40vw", "20vw"],
            height: "100vh",
          }}
        >
          <Stack direction="row">
            <Box
              component="img"
              alt="Avatar"
              src={authContext.account?.avatar}
              sx={{
                width: "25%",
                height: "auto",
                borderRadius: "50%",
                margin: "1rem 0",
              }}
            />
            <SideBarItemText text={authContext.account?.firstName ?? ""} />
          </Stack>
          <Stack spacing={2}>
            <SideBarItem
              muiIcon={<HomeOutlined />}
              text="Home"
              activeUrl="/home"
            />
            <SideBarItem
              muiIcon={<FaceRetouchingNaturalOutlined />}
              text="My Levels"
              activeUrl="/levels"
            />
            <SideBarItem
              muiIcon={<SentimentSatisfiedAltOutlined />}
              text="Profile"
              activeUrl="/profile"
            />
            <SideBarItem
              muiIcon={<FolderSharedOutlined />}
              text="Account"
              activeUrl="/account"
            />
            <SideBarItem
              muiIcon={<RoomOutlined />}
              text="Location"
              activeUrl="/location"
            />
            <SideBarItem
              muiIcon={<HelpOutlineOutlined />}
              text="Help"
              activeUrl="/help"
            />
          </Stack>
        </Container>
      </Drawer>
    </Container>
  );
}
