import Drawer from "@mui/material/Drawer";
import { useAppContentContext, useAuthContext, useI18nContext } from "../../../hooks";
import { Box, Container, Divider, Stack } from "@mui/material";
import {
  HomeOutlined,
  FaceRetouchingNaturalOutlined,
  SentimentSatisfiedAltOutlined,
  FolderSharedOutlined,
  RoomOutlined,
  HelpOutlineOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import SideBarItemText from "./SideBarItemText";
import SideBarItem from "./SideBarItem";
import SideBarOpener from "./SideBarOpener";

export default function SideBar() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  const authContext = useAuthContext();
  const languageContext = useI18nContext();
  const lang = languageContext.of(SideBar);

  return (
    <Container>
      <Drawer
        anchor="left"
        open={isActive}
        onClose={() => appContentContext.setMenuSideActive(false)}
      >
        <Container
          sx={{
            width: ["70vw", "40vw", "30vw", "20vw"],
            height: "100vh",
          }}
        >
          <Stack direction="row">
            <Box
              component="img"
              alt={lang("avatar")}
              src={authContext.account?.avatar}
              sx={{
                width: "25%",
                height: "auto",
                borderRadius: "50%",
                margin: "1rem 0",
              }}
            />
            <SideBarItemText text={authContext.account?.firstName ?? ""} />
            <Stack
              sx={{
                justifyContent: "center",
              }}
            >
              <SideBarOpener />
            </Stack>
          </Stack>
          <Divider />
          <Stack spacing={2}>
            <SideBarItem
              muiIcon={<HomeOutlined />}
              text={lang("home")}
              activeUrl="/home"
            />
            <SideBarItem
              muiIcon={<FaceRetouchingNaturalOutlined />}
              text={lang("my-levels")}
              activeUrl="/level"
            />
            <SideBarItem
              muiIcon={<SentimentSatisfiedAltOutlined />}
              text={lang("profile")}
              activeUrl="/profile"
            />
            <SideBarItem
              muiIcon={<FolderSharedOutlined />}
              text={lang("account")}
              activeUrl="/account"
            />
            <SideBarItem
              muiIcon={<RoomOutlined />}
              text={lang("location")}
              activeUrl="/location"
            />
            <SideBarItem
              muiIcon={<HelpOutlineOutlined />}
              text={lang("help")}
              activeUrl="/help"
            />
            <Divider />
            <SideBarItem
              muiIcon={<SettingsOutlined />}
              text={lang("setting")}
              activeUrl="/setting"
            />
          </Stack>
        </Container>
      </Drawer>
    </Container>
  );
}
