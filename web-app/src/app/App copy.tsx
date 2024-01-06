import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from ".././components/signup/SignUpPage";
import SignInPage from ".././components/signin/SignInPage";
import AuthContextProvider from ".././contexts/AuthContext";
import IsNotAuthenticated from ".././auths/IsNotAuthenticated";
import AppContent from ".././components/AppContent";
import IsAuthenticated from "./common/auth/IsAuthenticated";
import PageNotFound from "./common/PageNotFound";
import SignUpVerifyPage from "./verify/Verify";
import AppContentContextProvider from "./AppContentContext";
import ToastifyUtil from "./components/util/ToastifyUtil";
import I18nContextProvider from "./I18nContext";

function App() {
  return (
    <I18nContextProvider>
      <AuthContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/*"
              element={
                <IsAuthenticated>
                  <AppContentContextProvider>
                    <AppContent />
                  </AppContentContextProvider>
                </IsAuthenticated>
              }
            />
            <Route
              path="signin"
              element={
                <IsNotAuthenticated>
                  <SignInPage />
                </IsNotAuthenticated>
              }
            />

            <Route
              path="signup"
              element={
                <IsNotAuthenticated>
                  <SignUpPage />
                </IsNotAuthenticated>
              }
            />

            <Route path="signup/verify" element={<SignUpVerifyPage />} />

            <Route path="error/page-wrong" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        {/* Utils */}
        <>
          <ToastifyUtil />
        </>
      </AuthContextProvider>
    </I18nContextProvider>
  );
}

export default App;
