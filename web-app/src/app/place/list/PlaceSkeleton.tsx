import React from "react";
import { Box, BoxProps, Skeleton, Stack } from "@mui/material";

type PlaceSkeletonProps = BoxProps;

const PlaceSkeleton = React.forwardRef<HTMLDivElement, PlaceSkeletonProps>(
  (props, ref) => {
    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Stack direction={"row"} gap={1} mt={1}>
          <Skeleton variant="circular" width={"20%"} height={"auto"} />
          <Box flex={1}>
            <Skeleton variant="text" width={"100%"} />

            <Skeleton variant="text" width={"70%"} />
            <Skeleton variant="text" width={"80%"} />
            <Skeleton variant="text" width={"95%"} />
            <Skeleton variant="text" width={"80%"} />
          </Box>
        </Stack>
      </Box>
    );
  }
);

export default PlaceSkeleton;
