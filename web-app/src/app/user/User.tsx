import { Route, Routes } from "react-router-dom";
import UsersAroundPage from "./around/UsersAroundPage";
import UserViewerPage from "./viewer/UserViewerPage";

export default function User() {
  return (
    <Routes>
      <Route path="/" element={<UsersAroundPage />} />
      <Route path="/around/*" element={<UsersAroundPage />} />
      <Route path="/:id/*" element={<UserViewerPage />} />
    </Routes>
  );
}
