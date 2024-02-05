import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { IPlaceExposed } from "../../../data";

type PlaceRatingProps = BoxProps & {
  data: IPlaceExposed;
};

const PlaceRating = React.forwardRef<HTMLDivElement, PlaceRatingProps>(
  (props, ref) => {
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
        <Typography>
          {" "}
          {data.rating.count} lượt, đánh giá {data.rating.mean}/5.0{" "}
        </Typography>
      </Box>
    );
  }
);

export default PlaceRating;
