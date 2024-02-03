import React from "react";
import { Box, BoxProps } from "@mui/material";

type SubcribedPlaceProps = BoxProps;

const SubcribedPlace = React.forwardRef<HTMLDivElement, SubcribedPlaceProps>(
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
        Subcribed Place
      </Box>
    );
  }
);

export default SubcribedPlace;
