import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AppMainLeft from "./AppMainLeft";
import AppMainCenter from "./AppMainCenter";
import AppMainRight from "./AppMainRight";

export default function AppMain() {
    return (
      <Box
        sx={{
          width: "100%",
          padding: 0,
          margin: 0,
          boxSizing: "content-box",
          overflowY: "auto",
          overflowX: "hidden",
          flex: 1
        }}
      >
        <Grid2 container spacing={1}>
          <AppMainLeft />
          <AppMainCenter />
          <AppMainRight />
        </Grid2>
      </Box>
    );
}