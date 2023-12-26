import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./components/signup/SignUpPage";
import SignInPage from "./components/signin/SignInPage";
import AuthContextProvider from "./contexts/AuthContext";
import IsNotAuthenticated from "./auths/IsNotAuthenticated";
import AppContent from "./components/AppContent";
import IsAuthenticated from "./auths/IsAuthenticated";
import PageNotFound from "./components/PageNotFound";
import SignUpVerifyPage from "./components/signup/SignUpVerifyPage";
import AppContentContextProvider from "./contexts/AppContentContext";
import ToastifyUtil from "./components/util/ToastifyUtil";

function App() {
  return (
    <>
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

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        {/* Utils */}
        <>
          <ToastifyUtil />
        </>
      </AuthContextProvider>
    </>
  );
}

export default App;
