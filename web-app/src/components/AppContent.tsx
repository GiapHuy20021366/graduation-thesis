import { Box } from "@mui/material";
import SideBar from "./menu-side/SideBar";
import { Route, Routes } from "react-router-dom";
import HomeContent from "./content/HomeContent";
import LevelsContent from "./content/LevelsContent";
import ProfileContent from "./content/ProfileContent";
import AccountContent from "./content/AccountContent";
import LocationContent from "./content/LocationContent";
import HelpContent from "./content/HelpContent";

export default function AppContent() {
  return (
    <Box>
      <SideBar />
      <Routes>
        <Route path="/home" element={<HomeContent />} />
        <Route path="/levels" element={<LevelsContent />} />
        <Route path="/profile" element={<ProfileContent />} />
        <Route path="/account" element={<AccountContent />} />
        <Route path="/location" element={<LocationContent />} />
        <Route path="/help" element={<HelpContent />} />
      </Routes>
    </Box>
  );
}
