import React from "react";
import { Box, BoxProps } from "@mui/material";

type NearPlaceProps = BoxProps;

const NearPlace = React.forwardRef<HTMLDivElement, NearPlaceProps>(
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
        Near Place
      </Box>
    );
  }
);

export default NearPlace;
