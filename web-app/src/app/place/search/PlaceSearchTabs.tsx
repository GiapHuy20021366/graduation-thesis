import React from "react";
import { Stack, StackProps, Tab, Tabs } from "@mui/material";
import { HomeOutlined } from "@mui/icons-material";
import { useI18nContext, usePlaceSearchContext } from "../../../hooks";
import OrderIcon from "../../common/custom/OrderIcon";
import { OrderState, toNextOrderState } from "../../../data";
import { placeSearchTabs } from "./place-search-tab";

type PlaceSearchTabsProps = StackProps;

const PlaceSearchTabs = React.forwardRef<HTMLDivElement, PlaceSearchTabsProps>(
  (props, ref) => {
    const searchContext = usePlaceSearchContext();
    const i18nContext = useI18nContext();

    const lang = i18nContext.of(PlaceSearchTabs);

    const {
      tab,
      setTab,
      order,
      setOrder,
      doSearchRelative,
      doSearchDistance,
      doSearchRating,
    } = searchContext;

    const handleTabChange = (
      _event: React.SyntheticEvent<Element, Event>,
      value: any
    ) => {
      console.log(value);
      setTab(value);
    };

    const onTabRelativeClick = () => {
      // do search relative
      if (tab !== placeSearchTabs.RALATIVE) {
        doSearchRelative({
          refresh: true,
        });
      }
    };

    const onTabDistanceClick = () => {
      // do search distance
      if (tab === placeSearchTabs.DISTANCE) {
        const nextOrder = toNextOrderState(order?.distance ?? OrderState.NONE);
        setOrder({
          ...order,
          distance: nextOrder,
        });
        doSearchDistance(nextOrder, { refresh: true });
      } else {
        doSearchDistance(order?.distance, { refresh: true });
      }
    };

    const onTabRatingClick = () => {
      // do search rating
      if (tab === placeSearchTabs.RATING) {
        const nextOrder = toNextOrderState(order?.rating ?? OrderState.NONE);
        setOrder({
          ...order,
          rating: nextOrder,
        });
        doSearchRating(nextOrder, { refresh: true });
      } else {
        doSearchRating(order?.rating, { refresh: true });
      }
    };

    return (
      <Stack
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Tabs
          value={tab}
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
            label={lang("Liên quan")}
            icon={<HomeOutlined />}
            iconPosition="start"
            onClick={onTabRelativeClick}
          />
          <Tab
            label={lang("Khoảng cách")}
            icon={<OrderIcon order={order?.distance} />}
            iconPosition="end"
            onClick={onTabDistanceClick}
          />
          <Tab
            label={lang("Đánh giá")}
            icon={<OrderIcon order={order?.rating} />}
            iconPosition="end"
            onClick={onTabRatingClick}
          />
        </Tabs>
      </Stack>
    );
  }
);

export default PlaceSearchTabs;
