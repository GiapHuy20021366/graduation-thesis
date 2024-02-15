import React from "react";
import { Stack, StackProps } from "@mui/material";
import { usePlaceSearchContext } from "../../../hooks";

type PlaceSearchTabRelativeProps = StackProps & {
  active?: boolean;
};

const PlaceSearchTabRelative = React.forwardRef<
  HTMLDivElement,
  PlaceSearchTabRelativeProps
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
      Relative Place
    </Stack>
  );
});

export default PlaceSearchTabRelative;
