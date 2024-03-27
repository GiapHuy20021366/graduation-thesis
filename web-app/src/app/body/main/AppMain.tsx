import { Box } from "@mui/material";
import Grid2 from "@mui/material/Unstable_Grid2";
import AppMainLeft from "./AppMainLeft";
import AppMainCenter from "./AppMainCenter";
import AppMainRight from "./AppMainRight";
import { useAppContentContext } from "../../../hooks";

export default function AppMain() {
  const contentContext = useAppContentContext();
  return (
    <Box
      sx={{
        width: "100%",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        overflowY: "scroll",
        overflowX: "hidden",
        flex: 1,
        height: "100%",
      }}
      ref={contentContext.mainRef}
    >
      <Grid2 container spacing={1} height="100%">
        <AppMainLeft />
        <AppMainCenter />
        <AppMainRight />
      </Grid2>
    </Box>
  );
}
