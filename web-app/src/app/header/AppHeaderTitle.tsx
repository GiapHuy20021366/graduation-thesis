import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";

function HomeTitle() {
  return <span>Home</span>;
}

function LevelTitle() {
  return <span>Level</span>;
}

function ProfileTitle() {
  return <span>Profile</span>;
}

function AccountTitle() {
  return <span>Account</span>;
}

function LocationTitle() {
  return <span>Location</span>;
}

function HelpTitle() {
  return <span>Help</span>;
}

function SettingTitle() {
  return <span>Setting</span>;
}

function FoodTitle() {
  return <span>Food</span>;
}

function SearchTitle() {
  return <span>Food</span>;
}

function ArroundTitle() {
  return <span>Arround</span>;
}

export default function AppHeaderTitle() {
  return (
    <Box
      sx={{
        fontWeight: 600,
        fontSize: "1.5rem",
      }}
    >
      <Routes>
        <Route path="/" element={<HomeTitle />} />
        <Route path="/home/*" element={<HomeTitle />} />
        <Route path="/level/*" element={<LevelTitle />} />
        <Route path="/profile/*" element={<ProfileTitle />} />
        <Route path="/account/*" element={<AccountTitle />} />
        <Route path="/location/*" element={<LocationTitle />} />
        <Route path="/arround/*" element={<ArroundTitle />} />
        <Route path="/help/*" element={<HelpTitle />} />
        <Route path="/setting/*" element={<SettingTitle />} />
        <Route path="/food/*" element={<FoodTitle />} />
        <Route path="/search/*" element={<SearchTitle />} />
      </Routes>
    </Box>
  );
}
