import { Box } from "@mui/material";
import AppFooterExtensions from "./AppFooterExtensions";

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
      <AppFooterExtensions />
    </Box>
  );
}
