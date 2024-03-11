import React from "react";
import { Box, BoxProps } from "@mui/material";

type PlaceInfoContentProps = BoxProps;

const PlaceInfoContent = React.forwardRef<
  HTMLDivElement,
  PlaceInfoContentProps
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

export default PlaceInfoContent;
