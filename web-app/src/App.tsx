import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/login/LoginPage";
import AuthenticationContextProvider from "./contexts/AuthenticationContext";
import IsNotAuthenticated from "./auths/IsNotAuthenticated";
import DashBoard from "./components/DashBoard";
import IsAuthenticated from "./auths/IsAuthenticated";
import PageNotFound from "./components/PageNotFound";

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
              path="login"
              element={
                <IsNotAuthenticated>
                  <LoginPage />
                </IsNotAuthenticated>
              }
            />

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthenticationContextProvider>
    </>
  );
}

export default App;
