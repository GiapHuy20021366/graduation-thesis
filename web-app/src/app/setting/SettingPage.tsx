import { Box, Stack } from "@mui/material";
import ContentHeader from "../common/layout/ContentHeader";
import ContentBody from "../common/layout/ContentBody";
import ContentFooter from "../common/layout/ContentFooter";
import SettingLanguage from "./SettingLanguage";
import { useI18nContext } from "../../hooks";

export default function SettingPage() {
  const languageContext = useI18nContext();
  const lang = languageContext.of(SettingPage);
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
