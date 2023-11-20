import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUpPage from "./components/signup/SignUpPage";
import SignInPage from "./components/signin/SignInPage";
import AuthenticationContextProvider from "./contexts/AuthenticationContext";
import IsNotAuthenticated from "./auths/IsNotAuthenticated";
import DashBoard from "./components/DashBoard";
import IsAuthenticated from "./auths/IsAuthenticated";
import PageNotFound from "./components/PageNotFound";
import SignUpVerifyPage from "./components/signup/SignUpVerifyPage";

function App() {
  return (
    <>
      <AuthenticationContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path=""
              element={
                <IsAuthenticated>
                  <DashBoard />
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
      </AuthenticationContextProvider>
    </>
  );
}

export default App;
