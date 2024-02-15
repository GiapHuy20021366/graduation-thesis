import React from "react";
import { Stack, StackProps } from "@mui/material";
import PlaceSearchSearchBar from "./PlaceSearchSearchBar";
import PlaceSearchTabs from "./PlaceSearchTabs";

type PlaceSearchHeaderProps = StackProps;

const PlaceSearchHeader = React.forwardRef<
  HTMLDivElement,
  PlaceSearchHeaderProps
>((props, ref) => {
  return (
    <Stack
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <PlaceSearchSearchBar />
      <PlaceSearchTabs />
    </Stack>
  );
});

export default PlaceSearchHeader;
