import React from "react";
import { Box, BoxProps } from "@mui/material";

type PlaceViewerMapExposedContentProps = BoxProps;

const PlaceViewerMapExposedContent = React.forwardRef<
  HTMLDivElement,
  PlaceViewerMapExposedContentProps
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
      Vị trí của địa điểm
    </Box>
  );
});

export default PlaceViewerMapExposedContent;
