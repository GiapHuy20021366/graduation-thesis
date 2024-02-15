import React from "react";
import { Stack, StackProps } from "@mui/material";
import { usePlaceSearchContext } from "../../../hooks";

type PlaceSearchTabDistanceProps = StackProps & {
  active?: boolean;
};

const PlaceSearchTabDistance = React.forwardRef<
  HTMLDivElement,
  PlaceSearchTabDistanceProps
>((props, ref) => {
  const { active, ...rest } = props;

  const searchContext = usePlaceSearchContext();
  const { data } = searchContext;

  //   diplay data
  console.log(data);

  return (
    <Stack
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
        display: active ? "flex" : "none",
      }}
    >
      Distance Place
    </Stack>
  );
});

export default PlaceSearchTabDistance;
