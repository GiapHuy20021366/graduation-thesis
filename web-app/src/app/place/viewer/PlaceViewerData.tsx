import { Stack } from "@mui/material";
import PlaceViewerHeader from "./PlaceViewerHeader";
import { IPlaceExposed } from "../../../data";
import PlaceViewerTabs from "./PlaceViewerTabs";
import { useState } from "react";
import { PlaceViewerTab } from "./place-viewer-tab";
import PlaceViewerIntroduction from "./PlaceViewerIntroduction";
import PlaceViewerSharedFood from "./PlaceViewerSharedFood";
import PlaceViewerSubcribed from "./PlaceViewerSubcribed";

interface PlaceViewerDataProps {
  data: IPlaceExposed;
}

export default function PlaceViewerData({ data }: PlaceViewerDataProps) {
  const [tab, setTab] = useState<PlaceViewerTab>(0);

  console.log(data);

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

        <PlaceViewerSharedFood
          sx={{
            display: tab === PlaceViewerTab.FOOD ? "block" : "none",
          }}
        />

        <PlaceViewerSubcribed
          sx={{
            display: tab === PlaceViewerTab.SUBCRIBED ? "block" : "none",
          }}
        />
      </>
    </Stack>
  );
}
