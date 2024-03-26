import Grid2 from "@mui/material/Unstable_Grid2/Grid2";
import { Route, Routes } from "react-router-dom";
import Home from "../../home/Home";
import Location from "../../location/Location";
import PageNotFound from "../../common/PageNotFound";
import Setting from "../../setting/Setting";
import Food from "../../food/Food";
import Search from "../../search/Search";
import Place from "../../place/Place";
import Conversation from "../../conversation/Conversation";
import User from "../../user/User";

export default function AppMainCenter() {
  return (
    <Grid2 mobile={12} tablet={9} laptop={8} desktop={6} height="100%">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home/*" element={<Home />} />
        <Route path="/place/*" element={<Place />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/user/*" element={<User />} />
        <Route path="/location/*" element={<Location />} />
        <Route path="/conversation/*" element={<Conversation />} />

        <Route path="/setting/*" element={<Setting />} />
        <Route path="/search/*" element={<Search />} />
        <Route path="/*" element={<PageNotFound />} />
      </Routes>
    </Grid2>
  );
}