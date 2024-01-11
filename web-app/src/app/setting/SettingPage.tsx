import { Box, Stack } from "@mui/material";
import SettingLanguage from "./SettingLanguage";
import { useI18nContext } from "../../hooks";

export default function SettingPage() {
  const languageContext = useI18nContext();
  const lang = languageContext.of(SettingPage);
  return (
    <Stack>
      <Box>
        <Box component="h2">1. {lang("language")}</Box>
        <SettingLanguage />
      </Box>
    </Stack>
  );
}
