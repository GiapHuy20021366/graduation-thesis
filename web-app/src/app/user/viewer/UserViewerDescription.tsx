import React, { useState } from "react";
import {
  Box,
  BoxProps,
  Button,
  IconButton,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import { useComponentLanguage, useUserViewerContext } from "../../../hooks";
import { RichTextReadOnly } from "mui-tiptap";
import StarterKit from "@tiptap/starter-kit";
import { EditOutlined } from "@mui/icons-material";
import UserViewerDescriptionEditor from "./UserViewerDescriptionEditor";

type UserViewerDescriptionProps = BoxProps;

const UserViewerDescription = React.forwardRef<
  HTMLDivElement,
  UserViewerDescriptionProps
>((props, ref) => {
  const { ...rest } = props;
  const viewerContext = useUserViewerContext();
  const { isEditable, description } = viewerContext;
  const [openEditor, setOpenEditor] = useState<boolean>(false);
  const lang = useComponentLanguage();

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
        <h4>{lang("description")} </h4>
        {isEditable && (
          <Tooltip
            arrow
            children={
              <IconButton color="info" onClick={() => setOpenEditor(true)}>
                <EditOutlined />
              </IconButton>
            }
            title={lang("edit")}
          />
        )}
      </Stack>
      {(description == null || description === "") && (
        <Stack alignItems={"center"} flex={1}>
          <Typography>{lang("user-no-description")}</Typography>
          {isEditable && (
            <Stack gap={1}>
              <Button onClick={() => setOpenEditor(true)}>
                {lang("edit")}
              </Button>
            </Stack>
          )}
        </Stack>
      )}
      {description && (
        <RichTextReadOnly
          extensions={[StarterKit]}
          spell-check={false}
          content={description}
        />
      )}

      <UserViewerDescriptionEditor
        open={openEditor}
        onClose={() => setOpenEditor(false)}
        onCancel={() => setOpenEditor(false)}
        onSuccess={() => setOpenEditor(false)}
      />
    </Box>
  );
});

export default UserViewerDescription;
