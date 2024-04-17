import React, { useState } from "react";
import { Stack, StackProps } from "@mui/material";
import { useHomeViewerContext, useQueryDevice } from "../../hooks";
import ListEnd from "../common/viewer/data/ListEnd";
import HomeFoodItem from "./HomeFoodItem";
import LazyLoad from "react-lazy-load";
import FoodViewerDialog from "../common/viewer/dialog/FoodViewerDialog";
import PlaceViewerDialog from "../common/viewer/dialog/PlaceViewerDialog";
import UserViewerDialog from "../common/viewer/dialog/UserViewerDialog";
import EmptyList from "../common/viewer/data/EmptyList";

type HomeContentProps = StackProps;

const HomeContent = React.forwardRef<HTMLDivElement, HomeContentProps>(
  (props, ref) => {
    const [openFood, setOpenFood] = useState<string | undefined>();
    const [openAuthor, setOpenAuthor] = useState<string | undefined>();
    const [openPlace, setOpenPlace] = useState<string | undefined>();

    const device = useQueryDevice();
    const homeContext = useHomeViewerContext();
    const { displayedFoods, load } = homeContext;

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
          active={displayedFoods.length !== 0}
          onRetry={() => load()}
          mt={3}
        />
        <EmptyList
          active={displayedFoods.length === 0}
          onRetry={() => load()}
        />
      </Stack>
    );
  }
);

export default HomeContent;
