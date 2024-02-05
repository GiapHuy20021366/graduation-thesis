import React from "react";
import { Box, BoxProps } from "@mui/material";

type PlaceViewerSubcribedProps = BoxProps;

const PlaceViewerSubcribed = React.forwardRef<
  HTMLDivElement,
  PlaceViewerSubcribedProps
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
      Subcribed
    </Box>
  );
});

export default PlaceViewerSubcribed;
