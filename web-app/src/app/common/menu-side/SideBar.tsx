import Drawer from "@mui/material/Drawer";
import {
  applicationPages,
  useAppContentContext,
  useAuthContext,
  useI18nContext,
  usePageResolver,
} from "../../../hooks";
import {
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
} from "@mui/material";
import {
  HomeOutlined,
  SentimentSatisfiedAltOutlined,
  RoomOutlined,
  SettingsOutlined,
  People,
  LunchDiningOutlined,
} from "@mui/icons-material";
import SideBarItemText from "./SideBarItemText";
import SideBarOpener from "./SideBarOpener";
import StyledLink from "../navigate/StyledLink";

export default function SideBar() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  const authContext = useAuthContext();
  const languageContext = useI18nContext();
  const lang = languageContext.of(SideBar);

  const page = usePageResolver();

  return (
    <Drawer
      anchor="left"
      open={isActive}
      onClose={() => appContentContext.setMenuSideActive(false)}
      variant="temporary"
    >
      <Stack p={1} gap={1}>
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
        <MenuList
          sx={{ gap: 2 }}
          onClick={() => appContentContext.setMenuSideActive(false)}
        >
          {/* Home */}
          <StyledLink to={"/home"}>
            <MenuItem selected={page.is(applicationPages.HOME)}>
              <ListItemIcon>
                <HomeOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("home")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={"/user"}>
            <MenuItem selected={page.is(applicationPages.USER)}>
              <ListItemIcon>
                <SentimentSatisfiedAltOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("user")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={"/place"}>
            <MenuItem selected={page.is(applicationPages.PLACE)}>
              <ListItemIcon>
                <SentimentSatisfiedAltOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("place")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* Location */}
          <StyledLink to={"/location"}>
            <MenuItem selected={page.is(applicationPages.SET_LOCATION)}>
              <ListItemIcon>
                <RoomOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("location")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User Around */}
          <StyledLink to={"/user/around"}>
            <MenuItem selected={page.is(applicationPages.USER_AROUND)}>
              <ListItemIcon>
                <People fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("users-around-me")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* Food Around */}
          <StyledLink to={"/food/around"}>
            <MenuItem selected={page.is(applicationPages.FOOD_AROUND)}>
              <ListItemIcon>
                <LunchDiningOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("foods-around-me")}</ListItemText>
            </MenuItem>
          </StyledLink>

          <Divider />
          {/* Setting */}
          <StyledLink to={"/setting"}>
            <MenuItem selected={page.is(applicationPages.SETTING)}>
              <ListItemIcon>
                <SettingsOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("setting")}</ListItemText>
            </MenuItem>
          </StyledLink>
        </MenuList>
      </Stack>
    </Drawer>
  );
}
