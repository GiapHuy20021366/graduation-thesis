import { Stack } from "@mui/material";
import { IUserExposedWithFollower } from "../../../data";
import { useState } from "react";
import { UserViewerTab } from "./user-viewer-tab";
import UserViewerTabs from "./UserViewerTabs";
import UserViewerHeader from "./UserViewerHeader";
import UserViewerIntroduction from "./UserViewerIntroduction";

interface UserViewerDataProps {
  data: IUserExposedWithFollower;
}

export default function UserViewerData({ data }: UserViewerDataProps) {
  const [tab, setTab] = useState<UserViewerTab>(0);
  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={2} px={1}>
      <UserViewerHeader user={data} />
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
        <UserViewerIntroduction
          data={data}
          active={tab === UserViewerTab.DESCRIPTION}
        />

        {/* <PlaceViewerShared
          sx={{
            display: tab === PlaceViewerTab.FOOD ? "block" : "none",
          }}
          place={data}
          active={tab === PlaceViewerTab.FOOD}
        /> */}

        {/* <PlaceViewerSubcribed
          sx={{
            display: tab === PlaceViewerTab.SUBCRIBED ? "block" : "none",
          }}
          active={tab === PlaceViewerTab.SUBCRIBED}
          place={data}
        /> */}
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
