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
        height={"100svh"}
        m="0px -8px"
        p={0}
        sx={{
          overflowX: "hidden",
          overflowY: "hidden",
          backgroundColor: "background.default",
          color: "text.primary"
        }}
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
