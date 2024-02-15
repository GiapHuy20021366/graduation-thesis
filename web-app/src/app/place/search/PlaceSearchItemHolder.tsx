import React from "react";
import { Skeleton, Stack, StackProps } from "@mui/material";

type PlaceSearchItemHolderProps = StackProps;

const PlaceSearchItemHolder = React.forwardRef<HTMLDivElement, PlaceSearchItemHolderProps>(
  (props, ref) => {
    return (
      <Stack
        ref={ref}
        direction={"row"}
        gap={1}
        alignContent={"center"}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Skeleton variant="circular" width={45} height={45} />
        <Stack flex={1}>
          <Skeleton variant="text" width={"40%"} />
          <Skeleton variant="text" width={"80%"} />
        </Stack>
      </Stack>
    );
  }
);

export default PlaceSearchItemHolder;
