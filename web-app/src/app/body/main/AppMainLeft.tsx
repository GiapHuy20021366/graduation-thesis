import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import {
  Avatar,
  Box,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
} from "@mui/material";
import {
  HomeOutlined,
  SentimentSatisfiedAltOutlined,
  StorefrontOutlined,
  RoomOutlined,
  People,
  LunchDiningOutlined,
  SettingsOutlined,
} from "@mui/icons-material";
import {
  applicationPages,
  useAuthContext,
  useComponentLanguage,
  usePageResolver,
  useQueryDevice,
} from "../../../hooks";
import StyledLink from "../../common/navigate/StyledLink";
import SquareContainer from "../../common/custom/SquareContainer";

export default function AppMainLeft() {
  const lang = useComponentLanguage("SideBar");
  const page = usePageResolver();
  const device = useQueryDevice();
  const expand = device === "LAPTOP" || device === "DESKTOP";
  const authContext = useAuthContext();
  const { account } = authContext;
  const exposedName = account?.firstName ?? "" + account?.lastName ?? "";

  return (
    <Grid2
      mobile
      tablet
      laptop
      desktop
      display={["none", "block"]}
      position={"sticky"}
      top={0}
      height={"100%"}
      p={0}
    >
      <Box
        sx={{
          backgroundColor: "background.default",
          overflowY: "auto",
          overflowX: "hidden",
          height: "100%",
        }}
        width={expand ? "100%" : "fit-content"}
      >
        <MenuList
          sx={{
            fontWeight: 500,
            fontSize: "0.9375rem",
            ".MuiMenuItem-root": {
              flexDirection: expand ? "row" : "column",
              borderRadius: "5px",
              py: 1,
              px: 0,
              my: 0.3,
              ml: [0.5, 0.5, 0.5, 1],
            },
            ".MuiListItemText-root": {
              ".MuiTypography-root": {
                fontWeight: 500,
                fontSize: "1rem",
                textAlign: expand ? "left" : "center",
                ml: [0, 0, 1, 2],
              },
            },
          }}
        >
          <StyledLink to={applicationPages.USER}>
            <MenuItem>
              <SquareContainer size={"3em"}>
                <Avatar
                  src={account?.avatar}
                  sx={{
                    width: "100%",
                    height: "100%",
                  }}
                >
                  {exposedName[0] ?? ""}
                </Avatar>
              </SquareContainer>
              <ListItemText sx={{ display: expand ? "block" : "none" }}>
                {exposedName}
              </ListItemText>
            </MenuItem>
          </StyledLink>
          <Divider sx={{ backgroundColor: "inherit", my: 1 }} />
          {/* Home */}
          <StyledLink to={applicationPages.HOME}>
            <MenuItem selected={page.is(applicationPages.HOME)}>
              <ListItemIcon>
                <HomeOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("home")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={applicationPages.USER}>
            <MenuItem selected={page.is(applicationPages.USER)}>
              <ListItemIcon>
                <SentimentSatisfiedAltOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("user")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User */}
          <StyledLink to={applicationPages.PLACE}>
            <MenuItem selected={page.is(applicationPages.PLACE)}>
              <ListItemIcon>
                <StorefrontOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("place")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* Location */}
          <StyledLink to={applicationPages.SET_LOCATION}>
            <MenuItem selected={page.is(applicationPages.SET_LOCATION)}>
              <ListItemIcon>
                <RoomOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("location")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* User Around */}
          <StyledLink to={applicationPages.USER_AROUND}>
            <MenuItem selected={page.is(applicationPages.USER_AROUND)}>
              <ListItemIcon>
                <People fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("users-around-me")}</ListItemText>
            </MenuItem>
          </StyledLink>

          {/* Food Around */}
          <StyledLink to={applicationPages.FOOD_AROUND}>
            <MenuItem selected={page.is(applicationPages.FOOD_AROUND)}>
              <ListItemIcon>
                <LunchDiningOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("foods-around-me")}</ListItemText>
            </MenuItem>
          </StyledLink>

          <Divider sx={{ backgroundColor: "inherit", my: 1 }} />

          {/* Setting */}
          <StyledLink to={applicationPages.SETTING}>
            <MenuItem selected={page.is(applicationPages.SETTING)}>
              <ListItemIcon>
                <SettingsOutlined fontSize="large" />
              </ListItemIcon>
              <ListItemText>{lang("setting")}</ListItemText>
            </MenuItem>
          </StyledLink>
        </MenuList>
      </Box>
    </Grid2>
  );
}
