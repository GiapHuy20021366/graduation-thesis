import { Stack } from "@mui/material";
import { useState } from "react";
import { UserViewerTab } from "./user-viewer-tab";
import UserViewerTabs from "./UserViewerTabs";
import UserViewerHeader from "./UserViewerHeader";
import UserViewerIntroduction from "./UserViewerIntroduction";
import UserViewerShared from "./UserViewerShared";
import UserViewerSubcribed from "./UserViewerSubcribed";
import UserViewerPlace from "./UserViewerPlace";

export default function UserViewerData() {
  const [tab, setTab] = useState<UserViewerTab>(0);
  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={2} px={1}>
      <UserViewerHeader />
      <UserViewerTabs
        onTabSet={(tab) => setTab(tab)}
        sx={{
          position: "sticky",
          top: 1,
          zIndex: 1000,
          backgroundColor: "white",
        }}
      />
      {/* Tabs display */}
      <>
        <UserViewerIntroduction active={tab === UserViewerTab.DESCRIPTION} />

        <UserViewerShared active={tab === UserViewerTab.FOOD} />

        <UserViewerPlace active={tab === UserViewerTab.PLACE} />

        <UserViewerSubcribed active={tab === UserViewerTab.SUBCRIBED} />
      </>
      {/* <SpeedDial
        icon={<Add />}
        ariaLabel={"Add food"}
        sx={{ position: "absolute", bottom: 76, right: 26 }}
        onClick={() => navigate("/food/sharing?target=place&id=" + data._id)}
      /> */}
    </Stack>
  );
}
