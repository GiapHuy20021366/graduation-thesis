import React from "react";
import { Box, BoxProps } from "@mui/material";

type PlaceViewerDescriptionProps = BoxProps;

const PlaceViewerDescription = React.forwardRef<
  HTMLDivElement,
  PlaceViewerDescriptionProps
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
      Description
    </Box>
  );
});

export default PlaceViewerDescription;
