import { Box, Skeleton, Stack } from "@mui/material";
import SideBar from "./common/menu-side/SideBar";

import AppContentContextProvider from "./AppContentContext";
import AppMain from "./body/main/AppMain";

import { lazy, Suspense } from "react";
import AppHeaderHolder from "./body/header/AppHeaderHolder";
import AppFooterHolder from "./body/footer/AppFooterHolder";

const AppHeader = lazy(() => import("./body/header/AppHeader"));
const AppFooter = lazy(() => import("./body/footer/AppFooter"));

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
        <Suspense fallback={<AppHeaderHolder />}>
          <AppHeader />
        </Suspense>
        <Suspense fallback={<Skeleton width={"100%"} sx={{ flex: 1 }} />}>
          <AppMain />
        </Suspense>
        <Suspense fallback={<AppFooterHolder />}>
          <AppFooter
            sx={{
              display: ["flex", "none"],
            }}
          />
        </Suspense>
      </Stack>
      <Box>
        <SideBar />
      </Box>
    </AppContentContextProvider>
  );
}
