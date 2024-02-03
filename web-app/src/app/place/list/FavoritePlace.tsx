import React from "react";
import { Box, BoxProps } from "@mui/material";

type FavoritePlaceProps = BoxProps;

const FavoritePlace = React.forwardRef<HTMLDivElement, FavoritePlaceProps>((props, ref) => {
  return (
    <Box
      ref={ref}
      {...props}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      Favorite Place
    </Box>
  );
});

export default FavoritePlace;
