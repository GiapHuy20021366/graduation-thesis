import { Box } from "@mui/material";
import { Route, Routes } from "react-router-dom";

function HomeTitle() {
  return <span>Nhà</span>;
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
  return <span>Vị trí</span>;
}

function HelpTitle() {
  return <span>Help</span>;
}

function SettingTitle() {
  return <span>Cài đặt</span>;
}

function FoodTitle() {
  return <span>Thực phẩm</span>;
}

function SearchTitle() {
  return <span>Tìm kiếm</span>;
}

function AroundTitle() {
  return (
    <Routes>
      <Route path="/food/*" element={<span>Thực phẩm</span>} />
      <Route path="/users/*" element={<span>Người dùng</span>} />
    </Routes>
  );
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
        <Route path="/around/*" element={<AroundTitle />} />
        <Route path="/help/*" element={<HelpTitle />} />
        <Route path="/setting/*" element={<SettingTitle />} />
        <Route path="/food/*" element={<FoodTitle />} />
        <Route path="/search/*" element={<SearchTitle />} />
      </Routes>
    </Box>
  );
}
