import { SpeedDial, Stack, Tooltip } from "@mui/material";
import { useState } from "react";
import { UserViewerTab } from "./user-viewer-tab";
import UserViewerTabs from "./UserViewerTabs";
import UserViewerHeader from "./UserViewerHeader";
import UserViewerIntroduction from "./UserViewerIntroduction";
import UserViewerShared from "./UserViewerShared";
import UserViewerSubcribed from "./UserViewerSubcribed";
import UserViewerPlace from "./UserViewerPlace";
import { Add } from "@mui/icons-material";
import StyledLink from "../../common/navigate/StyledLink";
import { applicationPages, useComponentLanguage } from "../../../hooks";

export default function UserViewerData() {
  const [tab, setTab] = useState<UserViewerTab>(0);
  const lang = useComponentLanguage();
  return (
    <Stack width={"100%"} boxSizing={"border-box"} boxShadow={1} gap={2} px={1}>
      <UserViewerHeader />
      <UserViewerTabs
        onTabSet={(tab) => setTab(tab)}
        sx={{
          position: "sticky",
          top: 0,
          zIndex: 1000,
          backgroundColor: "background.default",
        }}
      />
      {/* Tabs display */}
      <>
        <UserViewerIntroduction active={tab === UserViewerTab.DESCRIPTION} />

        <UserViewerShared active={tab === UserViewerTab.FOOD} />

        <UserViewerPlace active={tab === UserViewerTab.PLACE} />

        <UserViewerSubcribed active={tab === UserViewerTab.SUBCRIBED} />
      </>
      <StyledLink
        to={applicationPages.FOOD_SHARING}
        style={{ position: "fixed", bottom: 76, right: 26 }}
      >
        <Tooltip arrow title={lang("add-food")} placement="left">
          <SpeedDial icon={<Add />} ariaLabel={"Add food"} />
        </Tooltip>
      </StyledLink>
    </Stack>
  );
}
