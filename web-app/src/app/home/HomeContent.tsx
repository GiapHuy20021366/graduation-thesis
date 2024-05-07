import React, { useEffect, useState } from "react";
import { Stack, StackProps } from "@mui/material";
import {
  useAppContentContext,
  useHomeViewerContext,
  useQueryDevice,
} from "../../hooks";
import ListEnd from "../common/viewer/data/ListEnd";
import HomeFoodItem from "./HomeFoodItem";
import LazyLoad from "react-lazy-load";
import FoodViewerDialog from "../common/viewer/dialog/FoodViewerDialog";
import PlaceViewerDialog from "../common/viewer/dialog/PlaceViewerDialog";
import UserViewerDialog from "../common/viewer/dialog/UserViewerDialog";
import EmptyList from "../common/viewer/data/EmptyList";
import { homeTabs } from "./home-tabs";
import ErrorRetry from "../common/viewer/data/ErrorRetry";
import FoodPostViewerHolder from "../food/post/FoodPostViewerHolder";

type HomeContentProps = StackProps;

const HomeContent = React.forwardRef<HTMLDivElement, HomeContentProps>(
  (props, ref) => {
    const [openFood, setOpenFood] = useState<string | undefined>();
    const [openAuthor, setOpenAuthor] = useState<string | undefined>();
    const [openPlace, setOpenPlace] = useState<string | undefined>();

    const device = useQueryDevice();
    const homeContext = useHomeViewerContext();
    const appContentContext = useAppContentContext();
    const {
      displayedFoods,
      load,
      aroundLoader,
      registeredLoader,
      favoriteLoader,
      tab,
    } = homeContext;

    const isLoad =
      aroundLoader.isFetching ||
      registeredLoader.isFetching ||
      favoriteLoader.isFetching;

    const isError = () => {
      switch (tab) {
        case homeTabs.ALL:
          return (
            aroundLoader.isError ||
            registeredLoader.isError ||
            favoriteLoader.isError
          );
        case homeTabs.AROUND:
          return aroundLoader.isError;
        case homeTabs.REGISTED:
          return registeredLoader.isError;
        case homeTabs.SUGGESTED:
          return favoriteLoader.isError;
      }
    };

    const error = isError();

    useEffect(() => {
      const main = appContentContext.mainRef?.current;
      let listener: any;

      if (main != null) {
        listener = (event: Event) => {
          const element = event.target as HTMLDivElement;
          const isAtBottom =
            element.scrollHeight * 0.95 <=
            element.scrollTop + element.clientHeight;
          if (isAtBottom && !error && !isLoad) {
            load();
          }
        };
        main.addEventListener("scroll", listener);
      }
      return () => {
        if (main != null && listener != null) {
          main.removeEventListener("scroll", listener);
        }
      };
    }, [appContentContext.mainRef, error, isLoad, load]);

    return (
      <Stack
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          mt: 2,
          gap: 1,
          position: "relative",
          ...(props.sx ?? {}),
        }}
      >
        {displayedFoods.map((food) => {
          return (
            <LazyLoad key={food._id} height={"380px"}>
              <HomeFoodItem
                item={food}
                onExpandFood={() => setOpenFood(food._id)}
                onExpandAuthor={() => {
                  const author = food.user;
                  if (typeof author === "object") {
                    setOpenAuthor(author._id);
                  } else {
                    setOpenAuthor(author);
                  }
                }}
                onExpandPlace={() => {
                  const place = food.place;
                  if (typeof place === "object") {
                    setOpenPlace(place._id);
                  } else {
                    setOpenPlace(place);
                  }
                }}
              />
            </LazyLoad>
          );
        })}
        {openFood != null && (
          <FoodViewerDialog
            id={openFood}
            open={true}
            onClose={() => setOpenFood(undefined)}
            onCloseClick={() => setOpenFood(undefined)}
            fullScreen={device === "MOBILE"}
          />
        )}
        {openAuthor != null && (
          <UserViewerDialog
            id={openAuthor}
            open={true}
            onClose={() => setOpenAuthor(undefined)}
            onCloseClick={() => setOpenAuthor(undefined)}
            fullScreen={device === "MOBILE"}
          />
        )}
        {openPlace != null && (
          <PlaceViewerDialog
            id={openPlace}
            open={true}
            onClose={() => setOpenPlace(undefined)}
            onCloseClick={() => setOpenPlace(undefined)}
            fullScreen={device === "MOBILE"}
          />
        )}

        <ListEnd
          active={displayedFoods.length !== 0 && !isLoad && !error}
          onRetry={() => load()}
          mt={3}
        />
        <EmptyList
          active={displayedFoods.length === 0 && !isLoad && !error}
          onRetry={() => load()}
        />

        <ErrorRetry active={!isLoad && error} onRetry={() => load()} />
        {isLoad && <FoodPostViewerHolder />}
      </Stack>
    );
  }
);

export default HomeContent;
