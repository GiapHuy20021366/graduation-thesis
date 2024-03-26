import { useContext } from "react";
import { ThemeContext } from "../app/ThemeContextProvider";

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error(
      "useThemeContext must be used within a ThemeContextProvider"
    );
  }
  return context;
}
