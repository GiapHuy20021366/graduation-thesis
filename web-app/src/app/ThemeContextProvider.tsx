import { PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";
import { darkThemeOptions, whiteThemeOptions } from "../themes";

interface IThemeContextProviderProps {
  children?: React.ReactNode;
}

interface IThemeContext {
  mode: PaletteMode;
  setMode: Dispatch<SetStateAction<PaletteMode>>;
}

export const ThemeContext = createContext<IThemeContext>({
  mode: "light",
  setMode: () => {},
});

const THEME_STORAGE_KEY = "theme";

const getTheme = (): PaletteMode => {
  const item = localStorage.getItem(THEME_STORAGE_KEY);
  if (item === "light" || item === "dark") {
    return item as PaletteMode;
  }
  return "light";
};

export default function ThemeContextProvider({
  children,
}: IThemeContextProviderProps) {
  const [mode, setMode] = useState<PaletteMode>(getTheme());

  const theme = React.useMemo(() => {
    switch (mode) {
      case "light":
        return createTheme(whiteThemeOptions);
      case "dark":
        return createTheme(darkThemeOptions);
    }
  }, [mode]);

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
