import React from "react";
import { Stack, StackProps } from "@mui/material";
import { IPlaceExposed } from "../../../data";
import { useDistanceCalculation } from "../../../hooks";

type PlaceSearchItemProps = StackProps & {
  data: IPlaceExposed;
};

const PlaceSearchItem = React.forwardRef<HTMLDivElement, PlaceSearchItemProps>(
  (props, ref) => {
    const { data, ...rest } = props;

    return (
      <Stack
        ref={ref}
        {...rest}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        {JSON.stringify(data)}
      </Stack>
    );
  }
);

export default PlaceSearchItem;
