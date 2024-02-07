import React from "react";
import { Stack, StackProps, Typography } from "@mui/material";
import { PlaceType, toPlaceTypeLabel } from "../../../data";
import {
  LocalConvenienceStore,
  LocalGroceryStore,
  Person,
  Restaurant,
  Storefront,
  VolunteerActivism,
} from "@mui/icons-material";
import { useI18nContext } from "../../../hooks";

type PlaceViewerExposedTypeProps = StackProps & {
  placeType: PlaceType;
};

const PlaceViewerExposedType = React.forwardRef<
  HTMLDivElement,
  PlaceViewerExposedTypeProps
>((props, ref) => {
  const { placeType, ...rest } = props;
  const i18nContext = useI18nContext();
  const lang = i18nContext.of(PlaceViewerExposedType);
  return (
    <Stack
      ref={ref}
      direction={"row"}
      gap={1}
      alignItems={"center"}
      {...rest}
      sx={{
        width: "100%",
        ...(props.sx ?? {}),
      }}
    >
      {[placeType].map((type) => {
        switch (type) {
          case PlaceType.PERSONAL:
            return <Person color="info" />;
          case PlaceType.VOLUNTEER:
            return <VolunteerActivism color="info" />;
          case PlaceType.EATERY:
            return <Storefront color="info" />;
          case PlaceType.RESTAURANT:
            return <Restaurant color="info" />;
          case PlaceType.SUPERMARKET:
            return <LocalGroceryStore color="info" />;
          case PlaceType.GROCERY:
            return <LocalConvenienceStore color="info" />;
          default:
            return <></>;
        }
      })}
      <Typography>{lang(toPlaceTypeLabel(placeType))}</Typography>
    </Stack>
  );
});

export default PlaceViewerExposedType;
