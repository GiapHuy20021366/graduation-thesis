import React, { useEffect } from "react";
import { Box, BoxProps, Tab, Tabs } from "@mui/material";
import { useI18nContext, useTabNavigate } from "../../../hooks";
import {
  LunchDiningOutlined,
  NotificationsActiveOutlined,
  StorefrontOutlined,
  TipsAndUpdatesOutlined,
} from "@mui/icons-material";
import { UserViewerTab, userViewerTabs } from "./user-viewer-tab";

type UserViewerTabsProps = BoxProps & {
  onTabSet?: (tab: UserViewerTab) => void;
};

const UserViewerTabs = React.forwardRef<HTMLDivElement, UserViewerTabsProps>(
  (props, ref) => {
    const { onTabSet, ...rest } = props;

    const tabNavigate = useTabNavigate({ tabOptions: userViewerTabs });

    const i18nContext = useI18nContext();
    const lang = i18nContext.of(UserViewerTabs);

    const handleTabChange = (
      _event: React.SyntheticEvent<Element, Event>,
      value: any
    ) => {
      tabNavigate.setTab(value);
    };

    useEffect(() => {
      const tab = tabNavigate.tab ?? UserViewerTab.DESCRIPTION;
      onTabSet && onTabSet(tab as UserViewerTab);
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
            label={lang("introduction")}
            icon={<TipsAndUpdatesOutlined />}
            iconPosition="start"
          />
          <Tab
            label={lang("shared")}
            icon={<LunchDiningOutlined />}
            iconPosition="start"
          />
          <Tab
            label={lang("place")}
            icon={<StorefrontOutlined />}
            iconPosition="start"
          />
          <Tab
            label={lang("subcriber")}
            icon={<NotificationsActiveOutlined />}
            iconPosition="start"
          />
        </Tabs>
      </Box>
    );
  }
);

export default UserViewerTabs;
