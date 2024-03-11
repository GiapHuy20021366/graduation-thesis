import React from "react";
import { Box, BoxProps, Typography } from "@mui/material";
import { FoodCategory } from "../../../data";
import CategoryPiece from "../../food/sharing/CategoryPiece";
import { useI18nContext } from "../../../hooks";

type UserViewerCategoriesProps = BoxProps & {
  categories: FoodCategory[];
};

const UserViewerCategories = React.forwardRef<
  HTMLDivElement,
  UserViewerCategoriesProps
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
        ...(props.sx ?? {}),
      }}
    >
      <h4>Quan tâm </h4>
      {categories.length > 0 && (
        <Box padding={"1rem 0"}>
          {categories.map((category, index) => {
            return <CategoryPiece text={lang(category)} key={index} />;
          })}
        </Box>
      )}

      {categories.length === 0 && (
        <Typography>
          Người dùng chưa miêu tả cụ thể loại thực phẩm quan tâm hoặc muốn chia
          sẻ
        </Typography>
      )}
    </Box>
  );
});

export default UserViewerCategories;
