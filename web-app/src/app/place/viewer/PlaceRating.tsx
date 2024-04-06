import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { IPlaceExposed } from "../../../data";
import { useComponentLanguage } from "../../../hooks";

type PlaceRatingProps = BoxProps & {
  data: IPlaceExposed;
};

const PlaceRating = React.forwardRef<HTMLDivElement, PlaceRatingProps>(
  (props, ref) => {
    const { data, ...rest } = props;
    const lang = useComponentLanguage();

    return (
      <Box
        ref={ref}
        {...rest}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Typography>
          {lang(
            "rated-point",
            data.rating.count,
            data.rating.mean.toFixed(1),
            "5.0"
          )}
        </Typography>
      </Box>
    );
  }
);

export default PlaceRating;
