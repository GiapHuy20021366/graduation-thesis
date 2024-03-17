import React, { ReactNode, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  BoxProps,
  MenuItem,
  Select,
} from "@mui/material";
import { ExpandMore } from "@mui/icons-material";
import StarterKit from "@tiptap/starter-kit";
import {
  RichTextEditor,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  MenuButtonBold,
  MenuButtonItalic,
  MenuButtonBulletedList,
  RichTextEditorRef,
} from "mui-tiptap";
import { useI18nContext } from "../../../hooks";

type ExtendedEditorProps = BoxProps & {
  defaultHTML?: string;
  onHTMLChange?: (newContent: string) => void;
  defaulExpaned?: boolean;
  sumaryElement?: ReactNode;
  editorRef?: React.Ref<RichTextEditorRef>;
};

const EditMode = {
  HIDE: "HIDE",
  EDIT: "EDIT",
  PREVIEW: "PREVIEW",
} as const;

export type EditMode = (typeof EditMode)[keyof typeof EditMode];

const ExtendedEditor = React.forwardRef<HTMLDivElement, ExtendedEditorProps>(
  (props, ref) => {
    const {
      defaultHTML,
      onHTMLChange,
      defaulExpaned,
      sumaryElement,
      editorRef,
      ...rest
    } = props;
    const [editable, setEditable] = useState<EditMode>(EditMode.EDIT);
    const i18n = useI18nContext();
    const lang = i18n.of(ExtendedEditor);

    return (
      <Box
        ref={ref}
        {...rest}
        sx={{
          width: "100%",
          ...(props.sx ?? {}),
        }}
      >
        <Accordion defaultExpanded={defaulExpaned}>
          <AccordionSummary
            expandIcon={<ExpandMore />}
            sx={{
              paddingLeft: 0,
              ">.MuiAccordionSummary-content": {
                margin: 0,
                ">.Mui-expanded": {
                  margin: 0,
                },
              },
            }}
          >
            {sumaryElement}
          </AccordionSummary>
          <AccordionDetails
            sx={{
              paddingLeft: 0,
            }}
          >
            <RichTextEditor
              extensions={[StarterKit]}
              spell-check={false}
              content={defaultHTML}
              onUpdate={({ editor }) =>
                onHTMLChange && onHTMLChange(editor.getHTML())
              }
              ref={editorRef}
              renderControls={() => (
                <Box>
                  {
                    <MenuControlsContainer>
                      <Select
                        value={editable}
                        variant="standard"
                        onChange={(event) =>
                          setEditable(event.target.value as EditMode)
                        }
                      >
                        <MenuItem value={EditMode.EDIT}>
                          {lang("edit")}
                        </MenuItem>
                        <MenuItem value={EditMode.PREVIEW}>
                          {lang("preview")}
                        </MenuItem>
                      </Select>
                      {editable === EditMode.EDIT && (
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
          </AccordionDetails>
        </Accordion>
      </Box>
    );
  }
);

export default ExtendedEditor;
