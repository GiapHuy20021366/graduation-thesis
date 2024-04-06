import React from "react";
import { Stack, StackProps } from "@mui/material";
import { usePlaceSearchContext } from "../../../hooks";
import PlaceSearchItem from "./PlaceSearchItem";
import PlaceSearchItemHolder from "./PlaceSearchItemHolder";
import ListEnd from "../../common/viewer/data/ListEnd";
import ErrorRetry from "../../common/viewer/data/ErrorRetry";

type PlaceSearchContentProps = StackProps;

const PlaceSearchContent = React.forwardRef<
  HTMLDivElement,
  PlaceSearchContentProps
>((props, ref) => {
  const searchContext = usePlaceSearchContext();
  const { data, doSaveStorage, loader, doSearch } = searchContext;

  return (
    <Stack
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        gap: 1,
        ...(props.sx ?? {}),
      }}
    >
      {data.map((place, index) => {
        return (
          <PlaceSearchItem
            data={place}
            key={index}
            boxShadow={1}
            onBeforeNavigate={() => doSaveStorage()}
          />
        );
      })}
      {loader.isFetching && <PlaceSearchItemHolder />}
      <ListEnd active={loader.isEnd} onRetry={doSearch} />
      <ErrorRetry active={loader.isError} onRetry={doSearch} />
    </Stack>
  );
});

export default PlaceSearchContent;
