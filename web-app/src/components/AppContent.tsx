import { Box } from "@mui/material";
import SideBar from "./menu-side/SideBar";
import { Navigate, Route, Routes } from "react-router-dom";
import HomeContent from "./content/HomeContent";
import LevelsContent from "./content/LevelsContent";
import ProfileContent from "./content/ProfileContent";
import AccountContent from "./content/AccountContent";
import LocationContent from "./content/LocationContent";
import HelpContent from "./content/HelpContent";
import PageNotFound from "./PageNotFound";
import SettingContent from "./content/SettingContent";
import FoodSharingContent from "./content/FoodSharingContent";
import FoodPostContent from "./content/FoodPostContent";

export default function AppContent() {
  return (
    <Box>
      <SideBar />
      <Routes>
        <Route path="/" element={<Navigate to={"/home"} replace />} />
        <Route path="/home" element={<HomeContent />} />
        <Route path="/levels" element={<LevelsContent />} />
        <Route path="/profile" element={<ProfileContent />} />
        <Route path="/account" element={<AccountContent />} />
        <Route path="/location" element={<LocationContent />} />
        <Route path="/help" element={<HelpContent />} />
        <Route path="/setting" element={<SettingContent />} />
        <Route path="/sharing" element={<FoodSharingContent />} />
        <Route path="/food/:foodPostId" element={<FoodPostContent />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </Box>
  );
}
