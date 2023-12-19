import { Box, Button, Divider, Stack } from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
  type RichTextEditorRef,
} from "mui-tiptap";
import { useState } from "react";

interface IDescriptionEditorProps {
  editorRef?: React.RefObject<RichTextEditorRef>;
}

export default function DescriptionEditor({
  editorRef,
}: IDescriptionEditorProps) {
  const [editable, setEditable] = useState<boolean>(true);

  return (
    <Box spellCheck={false}>
      <RichTextEditor
        ref={editorRef}
        extensions={[StarterKit]}
        content="Description"
        spell-check={false}
        renderControls={() => (
          <Box>
            <Stack direction="row">
              <Box component="h4" flex={1}>
                Description
              </Box>
              <Stack direction="row">
                <Button onClick={() => setEditable(true)}>
                  {editable ? <u>Edit</u> : <>Edit</>}
                </Button>
                <Button onClick={() => setEditable(false)}>
                  {!editable ? <u>Preview</u> : <>Preview</>}
                </Button>
              </Stack>
            </Stack>
            <Divider />
            {editable && (
              <MenuControlsContainer>
                <MenuSelectHeading />
                <MenuDivider />
                <MenuButtonBold />
                <MenuButtonItalic />
                <MenuButtonBulletedList />
                {/* Add more controls here */}
              </MenuControlsContainer>
            )}
          </Box>
        )}
      />
    </Box>
  );
}
