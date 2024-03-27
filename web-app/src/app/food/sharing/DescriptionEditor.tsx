import { ExpandMore } from "@mui/icons-material";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  MenuItem,
  Select,
} from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonBulletedList,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditor,
} from "mui-tiptap";
import { useState } from "react";
import { useFoodSharingFormContext, useI18nContext } from "../../../hooks";

const EditMode = {
  HIDE: "HIDE",
  EDIT: "EDIT",
  PREVIEW: "PREVIEW",
} as const;

export type EditMode = (typeof EditMode)[keyof typeof EditMode];

export default function DescriptionEditor() {
  const [editable, setEditable] = useState<EditMode>(EditMode.EDIT);
  const i18n = useI18nContext();
  const lang = i18n.of(DescriptionEditor);
  const form = useFoodSharingFormContext();
  const { description, setDescription } = form;

  return (
    <Box
      spellCheck={false}
      sx={{
        border: "1px solid #bdbdbd",
        borderRadius: "4px",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMore />}
          sx={{
            paddingLeft: "8px",
            ">.MuiAccordionSummary-content": {
              margin: 0,
              ">.Mui-expanded": {
                margin: 0,
              },
            },
          }}
        >
          <Box component="h4" sx={{ padding: 0, margin: 0 }}>
            {lang("description")}
          </Box>
        </AccordionSummary>
        <AccordionDetails
          sx={{
            p: 0
          }}
        >
          <RichTextEditor
            extensions={[StarterKit]}
            spell-check={false}
            content={description}
            onUpdate={({ editor }) => setDescription(editor.getHTML())}
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
                      <MenuItem value={EditMode.EDIT}>{lang("edit")}</MenuItem>
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
