import { SpeedDial, Stack, Tooltip } from "@mui/material";
import PlaceViewerHeader from "./PlaceViewerHeader";
import {
  FollowType,
  IAccountExposed,
  IPlaceExposedWithRatingAndFollow,
} from "../../../data";
import PlaceViewerTabs from "./PlaceViewerTabs";
import { useState } from "react";
import { PlaceViewerTab } from "./place-viewer-tab";
import PlaceViewerIntroduction from "./PlaceViewerIntroduction";
import PlaceViewerSubcribed from "./PlaceViewerSubcribed";
import PlaceViewerShared from "./PlaceViewerShared";
import { Add } from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";
import { useAuthContext, useComponentLanguage } from "../../../hooks";

interface PlaceViewerDataProps {
  data: IPlaceExposedWithRatingAndFollow;
}
const isPermitEdit = (
  place: IPlaceExposedWithRatingAndFollow,
  account?: IAccountExposed
): boolean => {
  if (account == null) return false;
  if (place.userFollow == null) return false;
  if (
    place.userFollow.type !== FollowType.ADMIN ||
    place.userFollow.subcriber !== account._id
  )
    return false;
  return true;
};

export default function PlaceViewerData({ data }: PlaceViewerDataProps) {
  const [tab, setTab] = useState<PlaceViewerTab>(0);
  const lang = useComponentLanguage();
  const authContext = useAuthContext();
  const isEditable = isPermitEdit(data, authContext.account);

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

      {isEditable && (
        <StyledLink to={`/food/sharing?place=${data._id}`}>
          <Tooltip
            arrow
            children={
              <SpeedDial
                icon={<Add />}
                ariaLabel={lang("place-add-food-label")}
                sx={{ position: "fixed", bottom: 76, right: 26 }}
              />
            }
            title={lang("place-add-food-label")}
            placement="left"
          />
        </StyledLink>
      )}
    </Stack>
  );
}
