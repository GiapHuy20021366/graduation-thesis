import React from "react";
import { Box, BoxProps } from "@mui/material";

type SquareContainerProps = BoxProps & {
  size: number | string;
};

const SquareContainer = React.forwardRef<HTMLDivElement, SquareContainerProps>(
  (props, ref) => {
    const { size, ...rest } = props;
    return (
      <Box
        sx={{
          position: "relative",
          width: size,
          "::after": {
            content: '""',
            display: "block",
            paddingTop: "100%",
          },
        }}
      >
        <Box
          ref={ref}
          {...rest}
          sx={{
            ...rest.sx,
            position: "absolute",
            width: "100%",
            height: "100%",
          }}
        />
      </Box>
    );
  }
);

export default SquareContainer;
