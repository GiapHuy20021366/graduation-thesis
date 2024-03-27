import Drawer from "@mui/material/Drawer";
import {
  applicationPages,
  useAppContentContext,
  useAuthContext,
  useComponentLanguage,
  usePageResolver,
} from "../../../hooks";
import {
  Avatar,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Stack,
  Typography,
} from "@mui/material";
import {
  HomeOutlined,
  SentimentSatisfiedAltOutlined,
  RoomOutlined,
  SettingsOutlined,
  People,
  LunchDiningOutlined,
} from "@mui/icons-material";
import SideBarOpener from "./SideBarOpener";
import StyledLink from "../navigate/StyledLink";
import SquareContainer from "../custom/SquareContainer";

export default function SideBar() {
  const appContentContext = useAppContentContext();
  const isActive = appContentContext.menuSide.active;
  const authContext = useAuthContext();
  const { account } = authContext;
  const lang = useComponentLanguage("SideBar");

  const page = usePageResolver();

  const exposedName = account?.firstName ?? "" + account?.lastName ?? "";

  return (
    <Drawer
      anchor="left"
      open={isActive}
      onClose={() => appContentContext.setMenuSideActive(false)}
      variant="temporary"
    >
      <Stack sx={{ overflow: "hidden" }}>
        <Stack direction="row" gap={1} p={1} alignItems={"center"}>
          <SquareContainer size={"4em"}>
            <Avatar
              src={account?.avatar}
              sx={{ width: "100%", height: "100%" }}
            >
              {exposedName[0] ?? ""}
            </Avatar>
          </SquareContainer>
          <Typography>{exposedName}</Typography>
          <SideBarOpener />
        </Stack>
        <Divider sx={{ backgroundColor: "inherit" }} />
        <MenuList
          sx={{ gap: 2, overflowY: "auto" }}
          onClick={() => appContentContext.setMenuSideActive(false)}
        >
          {/* Home */}
          <StyledLink to={applicationPages.HOME}>
            <MenuItem selected={page.is(applicationPages.HOME)}>
              <ListItemIcon>
                <HomeOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("home")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={applicationPages.USER}>
            <MenuItem selected={page.is(applicationPages.USER)}>
              <ListItemIcon>
                <SentimentSatisfiedAltOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("user")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={applicationPages.PLACE}>
            <MenuItem selected={page.is(applicationPages.PLACE)}>
              <ListItemIcon>
                <SentimentSatisfiedAltOutlined fontSize="medium" />
              </ListItemIcon>
              <ListItemText>{lang("place")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* Location */}
          <StyledLink to={applicationPages.SET_LOCATION}>
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

          <Divider sx={{ backgroundColor: "inherit", my: 1 }} />

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
