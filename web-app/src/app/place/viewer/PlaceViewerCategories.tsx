import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { FoodCategory } from "../../../data";
import CategoryPiece from "../../food/sharing/CategoryPiece";
import { useI18nContext } from "../../../hooks";

type PlaceViewerCategoriesProps = BoxProps & {
  categories: FoodCategory[];
};

const PlaceViewerCategories = React.forwardRef<
  HTMLDivElement,
  PlaceViewerCategoriesProps
>((props, ref) => {
  const { categories, ...rest } = props;
  const i18nContext = useI18nContext();
  const lang = i18nContext.of("Categories");
  return (
    <Box
      ref={ref}
      {...rest}
      sx={{
        width: "100%",
        mb: 3,
        ...(props.sx ?? {}),
      }}
    >
      <h4>{lang("categories")}</h4>
      {categories.length > 0 && (
        <Box padding={"1rem 0"}>
          {categories.map((category, index) => {
            return <CategoryPiece text={lang(category)} key={index} />;
          })}
        </Box>
      )}

      {categories.length === 0 && (
        <Typography>{lang("place-no-categories")}</Typography>
      )}
    </Box>
  );
});

export default PlaceViewerCategories;
