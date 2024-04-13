import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./signup/SignUp";
import SignIn from "./signin/SignIn";
import IsNotAuthenticated from "./common/auth/IsNotAuthenticated";
import IsAuthenticated from "./common/auth/IsAuthenticated";
import PageNotFound from "./common/PageNotFound";
import Verify from "./verify/Verify";
import "react-toastify/dist/ReactToastify.css";
import ConversationContextProvider from "./ConversationContext";
import NotificationContextProvider from "./body/header/utils/notification/NotificationContext";
import AppContextProviders from "./AppContextProviders";

import { Suspense, lazy } from "react";
import AppContentHolder from "./AppContentHolder";
const AppContent = lazy(() => import("./AppContent"));

function App() {
  return (
    <AppContextProviders>
      <BrowserRouter>
        <Routes>
          <Route
            path="/*"
            element={
              <IsAuthenticated>
                <ConversationContextProvider>
                  <NotificationContextProvider>
                    <Suspense fallback={<AppContentHolder />}>
                      <AppContent />
                    </Suspense>
                  </NotificationContextProvider>
                </ConversationContextProvider>
              </IsAuthenticated>
            }
          />
          <Route
            path="/signin"
            element={
              <IsNotAuthenticated>
                <SignIn />
              </IsNotAuthenticated>
            }
          />

          <Route
            path="/signup"
            element={
              <IsNotAuthenticated>
                <SignUp />
              </IsNotAuthenticated>
            }
          />

          <Route path="/verify/*" element={<Verify />} />

          <Route path="/error/page-wrong" element={<PageNotFound />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>
      ;
    </AppContextProviders>
  );
}

export default App;
