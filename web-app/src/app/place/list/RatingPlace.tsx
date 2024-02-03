import React from "react";
import { Box, BoxProps } from "@mui/material";

type RatingPlaceProps = BoxProps;

const RatingPlace = React.forwardRef<HTMLDivElement, RatingPlaceProps>(
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
        Rating Place
      </Box>
    );
  }
);

export default RatingPlace;
