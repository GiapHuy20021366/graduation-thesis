import { Route, Routes } from "react-router-dom";
import UsersAroundPage from "./around/UsersAroundPage";

export default function User() {
  return (
    <Routes>
      <Route path="/" element={<UsersAroundPage />} />
      <Route path="/around/*" element={<UsersAroundPage />} />
    </Routes>
  );
}
