import { PaletteMode, ThemeProvider, createTheme } from "@mui/material";
import React, {
  Dispatch,
  SetStateAction,
  createContext,
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

export default function ThemeContextProvider({
  children,
}: IThemeContextProviderProps) {
  const [mode, setMode] = useState<PaletteMode>("light");

  const theme = React.useMemo(() => {
    switch (mode) {
      case "light":
        return createTheme(whiteThemeOptions);
      case "dark":
        return createTheme(darkThemeOptions);
    }
  }, [mode]);

  console.log(theme);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <ThemeProvider theme={theme}>{children}</ThemeProvider>
    </ThemeContext.Provider>
  );
}
