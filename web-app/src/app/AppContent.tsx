import { Box, Stack } from "@mui/material";
import SideBar from "./common/menu-side/SideBar";

import AppContentContextProvider from "./AppContentContext";
import AppHeader from "./body/header/AppHeader";
import AppFooter from "./body/footer/AppFooter";
import AppMain from "./body/main/AppMain";

export default function AppContent() {
  return (
    <AppContentContextProvider>
      <Stack
        direction={"column"}
        m={0}
        p={0}
        sx={{
          overflowX: "hidden",
          overflowY: "hidden",
        }}
        height={"100svh"}
        boxSizing={"border-box"}
      >
        <AppHeader />
        <AppMain />
        <AppFooter
          sx={{
            display: ["flex", "none"],
          }}
        />
      </Stack>
      <Box>
        <SideBar />
      </Box>
    </AppContentContextProvider>
  );
}
