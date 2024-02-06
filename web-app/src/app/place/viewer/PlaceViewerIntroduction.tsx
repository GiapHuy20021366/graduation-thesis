import React from "react";
import { Box, BoxProps } from "@mui/material";
import { IPlaceExposed } from "../../../data";
import PlaceViewerDescription from "./PlaceViewerDescription";

type PlaceViewerIntroductionProps = BoxProps & {
  data: IPlaceExposed;
};

const PlaceViewerIntroduction = React.forwardRef<
  HTMLDivElement,
  PlaceViewerIntroductionProps
>((props, ref) => {
  const { data, ...rest } = props;
  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      <PlaceViewerDescription data={data} />
    </Box>
  );
});

export default PlaceViewerIntroduction;
