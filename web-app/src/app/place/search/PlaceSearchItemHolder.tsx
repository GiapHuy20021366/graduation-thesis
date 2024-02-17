import React from "react";
import { Skeleton, Stack, StackProps } from "@mui/material";

type PlaceSearchItemHolderProps = StackProps;

const PlaceSearchItemHolder = React.forwardRef<
  HTMLDivElement,
  PlaceSearchItemHolderProps
>((props, ref) => {
  return (
    <Stack
      ref={ref}
      direction={"row"}
      {...props}
      sx={{
        width: "100%",
        gap: 1,
        py: 1,
        alignItems: "center",
        ...(props.sx ?? {}),
      }}
    >
      <Skeleton
        variant="circular"
        sx={{
          width: [90, 120, 150, 180],
          height: [90, 120, 150, 180],
          cursor: "pointer",
          boxShadow: 5,
        }}
      />
      <Stack gap={1} flex={1}>
        <Skeleton width={"100%"} variant="text" />
        <Skeleton width={"30%"} variant="text" />
        <Skeleton width={"60%"} variant="text" />
        <Skeleton width={"65%"} variant="text" />
        <Skeleton width={"80%"} variant="text" />
      </Stack>
    </Stack>
  );
});

export default PlaceSearchItemHolder;
