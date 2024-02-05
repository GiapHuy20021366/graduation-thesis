import React, { useEffect } from "react";
import { Box, BoxProps, Tab, Tabs } from "@mui/material";
import { useI18nContext, useTabNavigate } from "../../../hooks";
import {
  LunchDiningOutlined,
  NotificationsActiveOutlined,
  TipsAndUpdatesOutlined,
} from "@mui/icons-material";
import { PlaceViewerTab, placeViewerTabs } from "./place-viewer-tab";

type PlaceViewerTabsProps = BoxProps & {
  onTabSet?: (tab: PlaceViewerTab) => void;
};

const PlaceViewerTabs = React.forwardRef<HTMLDivElement, PlaceViewerTabsProps>(
  (props, ref) => {
    const { onTabSet, ...rest } = props;

    const tabNavigate = useTabNavigate({ tabOptions: placeViewerTabs });

    const i18nContext = useI18nContext();
    const lang = i18nContext.of(PlaceViewerTabs);

    const handleTabChange = (
      _event: React.SyntheticEvent<Element, Event>,
      value: any
    ) => {
      tabNavigate.setTab(value);
    };

    useEffect(() => {
      const tab = tabNavigate.tab ?? PlaceViewerTab.DESCRIPTION;
      onTabSet && onTabSet(tab as PlaceViewerTab);
    }, [onTabSet, tabNavigate.tab]);

    return (
      <Box
        ref={ref}
        {...rest}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Tabs
          value={tabNavigate.tab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons={false}
          sx={{
            ".MuiTab-root": {
              textTransform: "initial",
            },
          }}
        >
          <Tab
            label={lang("Giới thiệu")}
            icon={<TipsAndUpdatesOutlined />}
            iconPosition="start"
          />
          <Tab
            label={lang("Người theo dõi")}
            icon={<NotificationsActiveOutlined />}
            iconPosition="start"
          />
          <Tab
            label={lang("Đã chia sẻ")}
            icon={<LunchDiningOutlined />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
    );
  }
);

export default PlaceViewerTabs;
