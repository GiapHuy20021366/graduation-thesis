import React from "react";
import { Box, BoxProps } from "@mui/material";

type PlaceImageHolderProps = BoxProps & {
  imgSrc?: string | null;
};

const PlaceImageHolder = React.forwardRef<
  HTMLDivElement,
  PlaceImageHolderProps
>((props, ref) => {
  const { imgSrc, ...rest } = props;

  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      {imgSrc && <img src={imgSrc} loading="lazy" width={"100%"} />}
    </Box>
  );
});

export default PlaceImageHolder;
