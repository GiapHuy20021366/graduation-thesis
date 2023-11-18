import "../global";
import "styles/index.scss";
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import I18nContextProvider from "./contexts/I18nContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <I18nContextProvider>
      <App />
    </I18nContextProvider>
  </React.StrictMode>
);
