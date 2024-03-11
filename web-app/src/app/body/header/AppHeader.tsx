import { Box, Divider, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AppHeaderTitle from "./AppHeaderTitle";
import AppHeaderUtil from "./AppHeaderUtil";
import AppTabs from "../footer/AppTabs";
import AvatarButtonAction from "./utils/avatar-menu/AvavarButtonAction";

export default function AppHeader() {
  return (
    <Box
      sx={{
        width: "100%",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        boxShadow: 1,
      }}
    >
      <Grid2
        container
        spacing={1}
        sx={{
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid2 mobile tablet laptop desktop>
          <Stack direction={"row"} width={"100%"} alignItems={"center"} gap={1}>
            <AppHeaderUtil />
            <Divider orientation="vertical" flexItem />
            {/* <Box display={["none", "none", "block"]}>
              <AppHeaderTitle />
            </Box> */}
          </Stack>
        </Grid2>
        <Grid2 display={["none", "block", "block"]}>
          <AppTabs sx={{ display: "flex", justifyContent: "center" }} />
        </Grid2>
        <Grid2
          mobile
          tablet
          laptop
          desktop
          sx={{
            display: ["flex", "none"],
            justifyContent: "end",
          }}
        >
          <AppHeaderTitle />
        </Grid2>
        <Grid2
          mobile
          tablet
          laptop
          desktop
          sx={{
            display: ["none", "flex"],
          }}
        >
          <AvatarButtonAction sx={{ ml: "auto", mr: 1 }} />
        </Grid2>
      </Grid2>
    </Box>
  );
}
