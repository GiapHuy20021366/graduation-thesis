import { Chip, ChipProps } from "@mui/material";
import React from "react";

type IPurpleChipProps = ChipProps;

const PurpleChip = React.forwardRef<HTMLDivElement, IPurpleChipProps>(
  (props, ref) => {
    const defaultSx = {
      backgroundColor: "purple",
      width: "fit-content",
      px: 5,
      fontWeight: 600,
      fontSize: "1.3rem",
      color: "white",
      cursor: "pointer",
      ":hover": {
        backgroundColor: "white",
        color: "black",
      },
    };
    return (
      <Chip
        ref={ref}
        {...props}
        sx={{
          ...defaultSx,
          ...props.sx,
        }}
      />
    );
  }
);

export default PurpleChip;
