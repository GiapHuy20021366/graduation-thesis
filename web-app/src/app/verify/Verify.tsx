import { Route, Routes } from "react-router-dom";
import SignUpVerifyPage from "./signup/SignUpVerifyPage";
import PageNotFound from "../common/PageNotFound";

export default function Verify() {
  return (
    <Routes>
      <Route path="/signup" element={<SignUpVerifyPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
