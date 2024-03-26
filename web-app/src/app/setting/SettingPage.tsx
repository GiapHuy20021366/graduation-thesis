import { Box, Stack } from "@mui/material";
import SettingLanguage from "./SettingLanguage";
import { useI18nContext } from "../../hooks";
import SettingTheme from "./SettingTheme";

export default function SettingPage() {
  const languageContext = useI18nContext();
  const lang = languageContext.of(SettingPage);
  return (
    <Stack>
      <Box>
        <Box component="h2">1. {lang("language")}</Box>
        <SettingLanguage />
      </Box>
      <Box>
        <Box component="h2">2. {lang("theme")}</Box>
        <SettingTheme />
      </Box>
    </Stack>
  );
}
