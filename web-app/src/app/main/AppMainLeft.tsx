import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import AppSpeedDial from "./AppSpeedDial";

export default function AppMainLeft() {
  return (
    <Grid2
      mobile
      tablet
      laptop
      desktop
      display={["none", "block"]}
      position={"relative"}
    >
      <AppSpeedDial
        sx={{
          display: ["none", "block", "none", "none"],
        }}
      />
    </Grid2>
  );
}
