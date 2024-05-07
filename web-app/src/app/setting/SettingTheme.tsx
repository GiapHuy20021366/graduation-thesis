import React from "react";
import {
  FormControl,
  FormControlProps,
  InputLabel,
  MenuItem,
  PaletteMode,
  Select,
  SelectChangeEvent,
} from "@mui/material";
import { useI18nContext, useThemeContext } from "../../hooks";

type SettingThemeProps = FormControlProps;

const SettingTheme = React.forwardRef<HTMLDivElement, SettingThemeProps>(
  (props, ref) => {
    const languageContext = useI18nContext();
    const lang = languageContext.of();
    const theme = useThemeContext();

    const onChange = (event: SelectChangeEvent<PaletteMode>) => {
      theme.setMode(event.target.value as PaletteMode);
    };

    return (
      <FormControl
        ref={ref}
        {...props}
        sx={{
          ...(props.sx ?? {}),
          width: "100%",
        }}
      >
        <InputLabel id="select-label-theme">{lang("choose")}</InputLabel>
        <Select
          labelId="select-label-theme"
          id="select-theme"
          value={theme.mode}
          label={lang("choose-one")}
          onChange={(event) => onChange(event)}
          fullWidth
        >
          <MenuItem value="dark">{lang("dark")}</MenuItem>
          <MenuItem value="light">{lang("light")}</MenuItem>
        </Select>
      </FormControl>
    );
  }
);

export default SettingTheme;
