
import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import AuthenticationContextProvider from "./contexts/AuthenticationContext";
import IsNotAuthenticated from "./auths/IsNotAuthenticated";
import DashBoard from "./components/DashBoard";
import IsAuthenticated from "./auths/IsAuthenticated";

function App() {
  console.log("asasd".format(true, false, 1, "huy"));



  return (
    <>
      <AuthenticationContextProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="login"
              element={
                <IsNotAuthenticated>
                  <LoginPage />
                </IsNotAuthenticated>
              }
            />
            <Route
              path="dashboard"
              element={
                <IsAuthenticated>
                  <DashBoard />
                </IsAuthenticated>
              }
            />
          </Routes>
        </BrowserRouter>
      </AuthenticationContextProvider>
    </>
  );
}

export default App;
