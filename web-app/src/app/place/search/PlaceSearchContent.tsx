import React from "react";
import { Stack, StackProps } from "@mui/material";
import { usePlaceSearchContext } from "../../../hooks";
import PlaceSearchItem from "./PlaceSearchItem";

type PlaceSearchContentProps = StackProps;

const PlaceSearchContent = React.forwardRef<
  HTMLDivElement,
  PlaceSearchContentProps
>((props, ref) => {
  const searchContext = usePlaceSearchContext();
  const { data, doSaveLocalStorage } = searchContext;

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
            onBeforeNavigate={() => doSaveLocalStorage()}
          />
        );
      })}
    </Stack>
  );
});

export default PlaceSearchContent;
