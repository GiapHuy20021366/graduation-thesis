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
  StorefrontOutlined,
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
      <Stack sx={{ overflow: "hidden", width: ["280px"] }}>
        <Stack direction="row" gap={1} py={3} px={1} alignItems={"center"}>
          <SquareContainer size={"4em"}>
            <Avatar
              src={account?.avatar}
              sx={{ width: "100%", height: "100%" }}
            >
              {exposedName[0] ?? ""}
            </Avatar>
          </SquareContainer>
          <Typography>{exposedName}</Typography>
          <SideBarOpener
            sx={{ marginLeft: "auto" }}
            size="large"
            IconPropsSx={{
              fontSize: "35px",
            }}
          />
        </Stack>
        <Divider sx={{ backgroundColor: "inherit" }} />
        <MenuList
          sx={{
            overflowY: "auto",
            ".MuiListItemText-root": {
              ".MuiTypography-root": {
                fontWeight: 550,
                fontSize: "1rem",
                pl: 1,
              },
            },
            py: 3,
          }}
          onClick={() => appContentContext.setMenuSideActive(false)}
        >
          {/* Home */}
          <StyledLink to={applicationPages.HOME}>
            <MenuItem selected={page.is(applicationPages.HOME)} sx={{ gap: 2 }}>
              <ListItemIcon>
                <HomeOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("home")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={applicationPages.USER}>
            <MenuItem selected={page.is(applicationPages.USER)} sx={{ gap: 2 }}>
              <ListItemIcon>
                <SentimentSatisfiedAltOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("user")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={applicationPages.PLACE}>
            <MenuItem
              selected={page.is(applicationPages.PLACE)}
              sx={{ gap: 2 }}
            >
              <ListItemIcon>
                <StorefrontOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("place")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* Location */}
          <StyledLink to={applicationPages.SET_LOCATION}>
            <MenuItem
              selected={page.is(applicationPages.SET_LOCATION)}
              sx={{ gap: 2 }}
            >
              <ListItemIcon>
                <RoomOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("location")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User Around */}
          <StyledLink to={applicationPages.USER_AROUND}>
            <MenuItem
              selected={page.is(applicationPages.USER_AROUND)}
              sx={{ gap: 2 }}
            >
              <ListItemIcon>
                <People fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("users-around-me")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* Food Around */}
          <StyledLink to={applicationPages.FOOD_AROUND}>
            <MenuItem
              selected={page.is(applicationPages.FOOD_AROUND)}
              sx={{ gap: 2 }}
            >
              <ListItemIcon>
                <LunchDiningOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("foods-around-me")}</ListItemText>
            </MenuItem>
          </StyledLink>

          <Divider sx={{ backgroundColor: "inherit", my: 2 }} />

          {/* Setting */}
          <StyledLink to={applicationPages.SETTING}>
            <MenuItem
              selected={page.is(applicationPages.SETTING)}
              sx={{ gap: 2 }}
            >
              <ListItemIcon>
                <SettingsOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("setting")}</ListItemText>
            </MenuItem>
          </StyledLink>
        </MenuList>
      </Stack>
    </Drawer>
  );
}
