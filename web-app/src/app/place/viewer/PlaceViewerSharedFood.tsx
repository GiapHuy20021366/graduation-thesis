import React from "react";
import { Box, BoxProps } from "@mui/material";

type PlaceViewerSharedFoodProps = BoxProps;

const PlaceViewerSharedFood = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSharedFoodProps
>((props, ref) => {
  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      Shared
    </Box>
  );
});

export default PlaceViewerSharedFood;
