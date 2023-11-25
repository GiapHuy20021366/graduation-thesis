import "../global";
import "styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import I18nContextProvider from "./contexts/I18nContext.tsx";
import { ThemeProvider } from "@mui/material";
import { globalTheme } from "./themes/global-theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nContextProvider>
      <ThemeProvider theme={globalTheme}>
        <App />
      </ThemeProvider>
    </I18nContextProvider>
  </React.StrictMode>
);
