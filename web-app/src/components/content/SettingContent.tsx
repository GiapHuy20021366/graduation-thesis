import { Box, Stack } from "@mui/material";
import ContentHeader from "./layout/ContentHeader";
import ContentBody from "./layout/ContentBody";
import ContentFooter from "./layout/ContentFooter";
import SettingLanguage from "./setting/SettingLanguage";
import { useLanguageContext } from "../../contexts";

export default function SettingContent() {
  const languageContext = useLanguageContext();
  const lang = languageContext.of(SettingContent);
  return (
    <Stack
      sx={{
        height: "98vh",
        boxSizing: "border-box",
        justifyContent: "space-between",
      }}
    >
      <ContentHeader
        title={lang("title")}
        extensions={["notification", "location", "search"]}
      />
      <ContentBody>
        <Stack>
          <Box component="h2">1. {lang("language")}</Box>
          <SettingLanguage />
        </Stack>
      </ContentBody>
      <Box display={["block", "none", "none", "none"]}>
        <ContentFooter />
      </Box>
    </Stack>
  );
}
