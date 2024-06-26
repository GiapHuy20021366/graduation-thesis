import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useI18nContext } from "../../hooks";
import { LanguageCode } from "../../store";

export default function SettingLanguage() {
  const languageContext = useI18nContext();
  const lang = languageContext.of(SettingLanguage);
  const onChange = (event: SelectChangeEvent<LanguageCode>) => {
    languageContext.switchLanguage(event.target.value as LanguageCode);
  };
  return (
    <FormControl
      sx={{
        width: "100%",
      }}
    >
      <InputLabel id="select-label-language">{lang("choose")}</InputLabel>
      <Select
        labelId="select-label-language"
        id="select-language"
        value={languageContext.language.code}
        label={lang("choose-one")}
        onChange={(event) => onChange(event)}
      >
        <MenuItem value="vi">{lang("vietnamese")}</MenuItem>
        <MenuItem value="en">{lang("english")}</MenuItem>
      </Select>
    </FormControl>
  );
}
