import { Route, Routes } from "react-router";
import ProfilePage from "./ProfilePage";
import PersonalProfilePage from "./personal/PersonalProfilePage";

export default function Profile() {
  return (
    <Routes>
      <Route path="/" element={<ProfilePage />} />
      <Route path="/:id" element={<PersonalProfilePage />} />
    </Routes>
  );
}
