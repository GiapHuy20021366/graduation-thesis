import React from "react";
import { Box, BoxProps } from "@mui/material";

type FullWidthBoxProps = BoxProps;

const FullWidthBox = React.forwardRef<HTMLDivElement, FullWidthBoxProps>(
  (props, ref) => {
    return (
      <Box
        ref={ref}
        {...props}
        sx={{
          ...(props.sx ?? {}),
          width: "100%",
        }}
      />
    );
  }
);

export default FullWidthBox;
