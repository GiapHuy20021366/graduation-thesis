import React, { useState } from "react";
import {
  Box,
  BoxProps,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { FoodCategory } from "../../../data";
import CategoryPiece from "../../food/sharing/CategoryPiece";
import { useI18nContext, useUserViewerContext } from "../../../hooks";
import UserViewerCategoriesEditor from "./UserViewerCategoriesEditor";
import { EditOutlined } from "@mui/icons-material";

type UserViewerCategoriesProps = BoxProps & {
  categories: FoodCategory[];
};

const UserViewerCategories = React.forwardRef<
  HTMLDivElement,
  UserViewerCategoriesProps
>((props, ref) => {
  const { categories, ...rest } = props;
  const viewerContext = useUserViewerContext();
  const { isEditable } = viewerContext;
  const [openEditor, setOpenEditor] = useState<boolean>(false);
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
      <Stack direction={"row"} gap={1} alignItems={"center"}>
        <h4>Quan tâm </h4>
        {isEditable && (
          <Tooltip
            arrow
            children={
              <IconButton color="info" onClick={() => setOpenEditor(true)}>
                <EditOutlined />
              </IconButton>
            }
            title={"Chỉnh sửa"}
          />
        )}
      </Stack>
      {categories.length > 0 && (
        <Box py={0} px={0}>
          {categories.map((category, index) => {
            return <CategoryPiece text={lang(category)} key={index} />;
          })}
        </Box>
      )}

      {categories.length === 0 && (
        <Typography>{lang("user-no-categories")}</Typography>
      )}

      <UserViewerCategoriesEditor
        open={openEditor}
        onClose={() => setOpenEditor(false)}
        onCancel={() => setOpenEditor(false)}
        onSuccess={() => setOpenEditor(false)}
      />
    </Box>
  );
});

export default UserViewerCategories;
