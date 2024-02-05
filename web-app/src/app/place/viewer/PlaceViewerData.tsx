import { Stack } from "@mui/material";
import PlaceViewerHeader from "./PlaceHeader";
import { IPlaceExposed } from "../../../data";
import PlaceViewerTabs from "./PlaceViewerTabs";
import { useState } from "react";
import { PlaceViewerTab } from "./place-viewer-tab";
import PlaceViewerDescription from "./PlaceViewerDescription";
import PlaceViewerSharedFood from "./PlaceViewerSharedFood";
import PlaceViewerSubcribed from "./PlaceViewerSubcribed";

interface PlaceViewerDataProps {
  data: IPlaceExposed;
}

export default function PlaceViewerData({ data }: PlaceViewerDataProps) {
  const [tab, setTab] = useState<PlaceViewerTab>(0);

  console.log(data);

  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={2} p={1}>
      <PlaceViewerHeader place={data} />

      <PlaceViewerTabs onTabSet={(tab) => setTab(tab)} />
      {/* Tabs display */}
      <>
        {tab === PlaceViewerTab.DESCRIPTION && <PlaceViewerDescription />}
        {tab === PlaceViewerTab.FOOD && <PlaceViewerSharedFood />}
        {tab === PlaceViewerTab.SUBCRIBED && <PlaceViewerSubcribed />}
      </>
    </Stack>
  );
}
