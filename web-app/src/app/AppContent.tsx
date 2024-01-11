import { Box, Stack } from "@mui/material";
import SideBar from "./common/menu-side/SideBar";

import AppContentContextProvider from "./AppContentContext";
import AppHeader from "./header/AppHeader";
import AppFooter from "./footer/AppFooter";
import AppMain from "./main/AppMain";

export default function AppContent() {
  return (
    <AppContentContextProvider>
      <Stack
        direction={"column"}
        height={"100vh"}
        m="0px -8px"
        p={0}
        sx={{
          overflowX: "hidden",
          overflowY: "hidden"
        }}
      >
        <AppHeader />
        <AppMain />
        <AppFooter />
      </Stack>
      <Box>
        <SideBar />
      </Box>
    </AppContentContextProvider>
  );
}
