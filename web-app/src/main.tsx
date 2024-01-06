import "../global";
import "styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./app/App.tsx";
import { ThemeProvider } from "@mui/material";
import { globalTheme } from "./themes/global-theme.ts";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
      <ThemeProvider theme={globalTheme}>
        <App />
      </ThemeProvider>
  </React.StrictMode>
);
