import { Box, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  RichTextEditorProps,
  RichTextEditorRef,
} from "mui-tiptap";
import React, { useState } from "react";
import { useI18nContext } from "../../../hooks";

type EditorProps = Omit<RichTextEditorProps, "extensions"> & {
  onModeChange?: (mode: EditMode) => void;
  editorRef?: React.Ref<RichTextEditorRef>;
};

const EditMode = {
  HIDE: "HIDE",
  EDIT: "EDIT",
  PREVIEW: "PREVIEW",
} as const;

export type EditMode = (typeof EditMode)[keyof typeof EditMode];

const StarterKitEditor = React.forwardRef<HTMLDivElement, EditorProps>(
  (props) => {
    const { onModeChange, editorRef, ...rest } = props;
    const [editMode, setEditMode] = useState<EditMode>(EditMode.EDIT);
    const i18n = useI18nContext();
    const lang = i18n.of(StarterKitEditor);

    const handleModeChange = (
      event: SelectChangeEvent<"HIDE" | "EDIT" | "PREVIEW">
    ) => {
      const value = event.target.value as EditMode;
      setEditMode(value);
      onModeChange && onModeChange(value);
    };
    return (
      <RichTextEditor
        {...rest}
        extensions={[StarterKit]}
        spell-check={false}
        ref={editorRef}
        renderControls={() => (
          <Box>
            {
              <MenuControlsContainer>
                <Select
                  value={editMode}
                  variant="standard"
                  onChange={handleModeChange}
                >
                  <MenuItem value={EditMode.EDIT}>{lang("edit")}</MenuItem>
                  <MenuItem value={EditMode.PREVIEW}>
                    {lang("preview")}
                  </MenuItem>
                </Select>
                {editMode === EditMode.EDIT && (
                  <>
                    <MenuDivider />
                    <MenuSelectHeading />
                    <MenuDivider />
                    <MenuButtonBold />
                    <MenuButtonItalic />
                    <MenuButtonBulletedList />
                  </>
                )}
                {/* Add more controls here */}
              </MenuControlsContainer>
            }
          </Box>
        )}
      />
    );
  }
);

export default StarterKitEditor;
