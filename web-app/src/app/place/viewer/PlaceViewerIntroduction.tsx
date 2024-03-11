import React from "react";
import { Divider, Stack, StackProps } from "@mui/material";
import { IPlaceExposed } from "../../../data";
import PlaceViewerDescription from "./PlaceViewerDescription";
import PlaceViewerLocation from "./PlaceViewerLocation";
import PlaceViewerCategories from "./PlaceViewerCategories";

type PlaceViewerIntroductionProps = StackProps & {
  data: IPlaceExposed;
  active: boolean;
};

const PlaceViewerIntroduction = React.forwardRef<
  HTMLDivElement,
  PlaceViewerIntroductionProps
>((props, ref) => {
  const { data, active, ...rest } = props;
  return (
    <Stack
      ref={ref}
      gap={1}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
      display={active ? "flex" : "none"}
    >
      <PlaceViewerDescription data={data} />
      <Divider />
      <PlaceViewerLocation data={data} />
      <Divider />
      <PlaceViewerCategories categories={data.categories} />
    </Stack>
  );
});

export default PlaceViewerIntroduction;
