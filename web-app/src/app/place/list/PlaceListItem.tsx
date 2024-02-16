import React from "react";
import { Stack, StackProps } from "@mui/material";
import { IPlaceExposed } from "../../../data";

type PlaceListItemProps = StackProps & {
  data: IPlaceExposed;
};

const PlaceListItem = React.forwardRef<HTMLDivElement, PlaceListItemProps>(
  (props, ref) => {
    
    return (
      <Stack
        ref={ref}
        {...props}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        Near Place
      </Stack>
    );
  }
);

export default PlaceListItem;
