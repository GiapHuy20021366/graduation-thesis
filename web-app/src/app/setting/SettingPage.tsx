import { Box, Divider, Stack } from "@mui/material";
import SettingLanguage from "./SettingLanguage";
import { useI18nContext } from "../../hooks";
import SettingTheme from "./SettingTheme";

export default function SettingPage() {
  const languageContext = useI18nContext();
  const lang = languageContext.of(SettingPage);
  return (
    <Stack>
      <Box>
        <Box component="h2">{lang("language")}</Box>
        <SettingLanguage />
      </Box>
      <Divider sx={{mt: 2}} variant="fullWidth"/>
      <Box>
        <Box component="h2">{lang("theme")}</Box>
        <SettingTheme />
      </Box>
    </Stack>
  );
}
