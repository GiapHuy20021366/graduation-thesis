import { SpeedDial, Stack } from "@mui/material";
import PlaceViewerHeader from "./PlaceViewerHeader";
import { IPlaceExposed } from "../../../data";
import PlaceViewerTabs from "./PlaceViewerTabs";
import { useState } from "react";
import { PlaceViewerTab } from "./place-viewer-tab";
import PlaceViewerIntroduction from "./PlaceViewerIntroduction";
import PlaceViewerSubcribed from "./PlaceViewerSubcribed";
import PlaceViewerShared from "./PlaceViewerShared";
import { Add } from "@mui/icons-material";
import { useNavigate } from "react-router";

interface PlaceViewerDataProps {
  data: IPlaceExposed;
}

export default function PlaceViewerData({ data }: PlaceViewerDataProps) {
  const [tab, setTab] = useState<PlaceViewerTab>(0);
  const navigate = useNavigate();
  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={2} px={1}>
      <PlaceViewerHeader place={data} />

      <PlaceViewerTabs onTabSet={(tab) => setTab(tab)} />
      {/* Tabs display */}
      <>
        <PlaceViewerIntroduction
          data={data}
          sx={{
            display: tab === PlaceViewerTab.DESCRIPTION ? "flex" : "none",
          }}
        />

        <PlaceViewerShared
          sx={{
            display: tab === PlaceViewerTab.FOOD ? "block" : "none",
          }}
          place={data}
          active={tab === PlaceViewerTab.FOOD}
        />

        <PlaceViewerSubcribed
          sx={{
            display: tab === PlaceViewerTab.SUBCRIBED ? "block" : "none",
          }}
          active={tab === PlaceViewerTab.SUBCRIBED}
          place={data}
        />
      </>
      <SpeedDial
        icon={<Add />}
        ariaLabel={"Add food"}
        sx={{ position: "absolute", bottom: 76, right: 26 }}
        onClick={() => navigate("/food/sharing?target=place&id=" + data._id)}
      />
    </Stack>
  );
}