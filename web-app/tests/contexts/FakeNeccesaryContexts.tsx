import React from "react";
import FakeI18nContext from "./FakeI18nContext";
import FakeAuthContext from "./FakeAuthContext";
import FakeRoutes from "./FakeRoutes";
import { BrowserRouter } from "react-router-dom";
import ToastContextProvider from "../../src/app/ToastContext";
import FakeAppCacheContext from "./FakeAppCacheContext";
import FakeAppContentContext from "./FakeAppContentContext";

export default function FakeNeccesaryContexts({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <FakeI18nContext>
      <ToastContextProvider>
        <FakeAuthContext>
          <FakeAppCacheContext>
            <FakeAppContentContext>
              <BrowserRouter>
                <FakeRoutes>{children}</FakeRoutes>{" "}
              </BrowserRouter>
            </FakeAppContentContext>
          </FakeAppCacheContext>
        </FakeAuthContext>
      </ToastContextProvider>
    </FakeI18nContext>
  );
}
