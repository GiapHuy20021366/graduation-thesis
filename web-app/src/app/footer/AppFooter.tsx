import { Box } from "@mui/material";
import AppTabs from "./AppTabs";

export default function AppFooter() {
  return (
    <Box
      sx={{
        width: "100%",
        padding: 0,
        margin: 0,
        boxSizing: "border-box",
        display: ["block", "none"],
        boxShadow: 1,
      }}
    >
      <AppTabs sx={{ display: "flex", justifyContent: "center" }} />
    </Box>
  );
}
