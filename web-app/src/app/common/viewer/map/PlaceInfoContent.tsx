import React from "react";
import { Box, BoxProps } from "@mui/material";
import { useComponentLanguage } from "../../../../hooks";

type PlaceInfoContentProps = BoxProps;

const PlaceInfoContent = React.forwardRef<
  HTMLDivElement,
  PlaceInfoContentProps
>((props, ref) => {
  const lang = useComponentLanguage("ViewerData");
  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      {lang("place-location")}
    </Box>
  );
});

export default PlaceInfoContent;
