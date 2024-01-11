import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Route, Routes } from "react-router-dom";
import Home from "../home/Home";
import Level from "../level/Level";
import Profile from "../profile/Profile";
import Account from "../account/Account";
import Location from "../location/Location";
import Help from "../help/Help";
import PageNotFound from "../common/PageNotFound";
import Setting from "../setting/Setting";
import Food from "../food/Food";
import Search from "../search/Search";

export default function AppMainCenter() {
  return (
    <Grid2
      mobile={12}
      tablet={9}
      laptop={8}
      desktop={6}
    >
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/level/*" element={<Level />} />
        <Route path="/profile/*" element={<Profile />} />
        <Route path="/account/*" element={<Account />} />
        <Route path="/location/*" element={<Location />} />
        <Route path="/help/*" element={<Help />} />
        <Route path="/setting/*" element={<Setting />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/search/*" element={<Search />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Grid2>
  );
}
