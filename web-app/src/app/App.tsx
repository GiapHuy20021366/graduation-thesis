import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "./signup/SignUp";
import SignIn from "./signin/SignIn";
import AuthContextProvider from "./AuthContext";
import IsNotAuthenticated from "./common/auth/IsNotAuthenticated";
import AppContent from "./AppContent";
import IsAuthenticated from "./common/auth/IsAuthenticated";
import PageNotFound from "./common/PageNotFound";
import Verify from "./verify/Verify";
import I18nContextProvider from "./I18nContext";
import ToastContextProvider from "./ToastContext";
import PageProgessContextProvider from "./PageProgessContext";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <I18nContextProvider>
      <PageProgessContextProvider>
        <AuthContextProvider>
          <ToastContextProvider>
            <BrowserRouter>
              <Routes>
                <Route
                  path="/*"
                  element={
                    <IsAuthenticated>
                      <AppContent />
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
          </ToastContextProvider>
        </AuthContextProvider>
      </PageProgessContextProvider>
    </I18nContextProvider>
  );
}

export default App;
