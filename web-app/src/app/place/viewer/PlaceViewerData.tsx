import { SpeedDial, Stack, Tooltip } from "@mui/material";
import PlaceViewerHeader from "./PlaceViewerHeader";
import { IPlaceExposedWithRatingAndFollow } from "../../../data";
import PlaceViewerTabs from "./PlaceViewerTabs";
import { useState } from "react";
import { PlaceViewerTab } from "./place-viewer-tab";
import PlaceViewerIntroduction from "./PlaceViewerIntroduction";
import PlaceViewerSubcribed from "./PlaceViewerSubcribed";
import PlaceViewerShared from "./PlaceViewerShared";
import { Add } from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";
import { useComponentLanguage } from "../../../hooks";

interface PlaceViewerDataProps {
  data: IPlaceExposedWithRatingAndFollow;
}

export default function PlaceViewerData({ data }: PlaceViewerDataProps) {
  const [tab, setTab] = useState<PlaceViewerTab>(0);
  const lang = useComponentLanguage();
  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={0} px={1}>
      <PlaceViewerHeader place={data} />

      <PlaceViewerTabs
        onTabSet={(tab) => setTab(tab)}
        sx={{
          position: "sticky",
          top: 1,
          zIndex: 1000,
          boxShadow: 1,
          backgroundColor: "background.default",
          mt: 2,
        }}
      />
      {/* Tabs display */}
      <>
        <PlaceViewerIntroduction
          data={data}
          active={tab === PlaceViewerTab.DESCRIPTION}
          sx={{
            backgroundColor: "background.default",
            pl: 1,
          }}
        />

        <PlaceViewerShared
          place={data}
          active={tab === PlaceViewerTab.FOOD}
          sx={{
            backgroundColor: "background.default",
            pl: 1,
          }}
        />

        <PlaceViewerSubcribed
          active={tab === PlaceViewerTab.SUBCRIBED}
          place={data}
          sx={{
            backgroundColor: "background.default",
            pl: 1,
          }}
        />
      </>

      <StyledLink to={`/food/sharing?place=${data._id}`}>
        <Tooltip
          arrow
          children={
            <SpeedDial
              icon={<Add />}
              ariaLabel={lang("place-add-food-label")}
              sx={{ position: "absolute", bottom: 76, right: 26 }}
            />
          }
          title={lang("place-add-food-label")}
          placement="left"
        />
      </StyledLink>
    </Stack>
  );
}
