import React from "react";
import AppCacheContextProvider from "./AppCacheContext";
import AuthContextProvider from "./AuthContext";
import I18nContextProvider from "./I18nContext";
import PageProgessContextProvider from "./PageProgessContext";
import SocketContextProvider from "./SocketContext";
import ThemeContextProvider from "./ThemeContextProvider";
import ToastContextProvider from "./ToastContext";

interface IAppContextProvidersProps {
  children?: React.ReactNode;
}

export default function AppContextProviders({ children }: IAppContextProvidersProps) {
  return (
    <ThemeContextProvider>
      <I18nContextProvider>
        <ToastContextProvider>
          <AuthContextProvider>
            <PageProgessContextProvider>
              <AppCacheContextProvider>
                <SocketContextProvider>{children}</SocketContextProvider>
              </AppCacheContextProvider>
            </PageProgessContextProvider>
          </AuthContextProvider>
        </ToastContextProvider>
      </I18nContextProvider>
    </ThemeContextProvider>
  );
}
