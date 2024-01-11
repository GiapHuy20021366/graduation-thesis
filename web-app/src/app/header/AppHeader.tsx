import { Box, Divider, Stack } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AppHeaderTitle from "./AppHeaderTitle";
import AppHeaderUntil from "./AppHeaderUtil";
import AppFooterExtensions from "../footer/AppFooterExtensions";

export default function AppHeader() {
  return (
    <Box
      sx={{
        width: "100%",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
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
            <AppHeaderUntil />
            <Divider orientation="vertical" flexItem />
            <Box display={["none", "block"]}>
              <u>
                <AppHeaderTitle />
              </u>
            </Box>
          </Stack>
        </Grid2>
        <Grid2 display={["none", "none", "block"]}>
          <AppFooterExtensions />
        </Grid2>
        <Grid2
          mobile
          tablet
          laptop
          desktop
          sx={{
            display: ["flex", "none"],
            justifyContent: "end",
            pr: "0.5em",
          }}
        >
          <u>
            <AppHeaderTitle />
          </u>
        </Grid2>
        <Grid2
          mobile
          tablet
          laptop
          desktop
          sx={{
            display: ["none", "flex"],
          }}
        ></Grid2>
      </Grid2>
    </Box>
  );
}
