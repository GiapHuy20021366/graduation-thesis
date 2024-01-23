import { Route, Routes } from "react-router-dom";
import UsersArroundPage from "./users/UsersArroundPage";
import PageNotFound from "../common/PageNotFound";
import FoodArroundPage from "./food/FoodAroundPage";

export default function Arround() {
  return (
    <Routes>
      <Route path="/" element={<UsersArroundPage />} />
      <Route path="/users" element={<UsersArroundPage />} />
      <Route path="/food" element={<FoodArroundPage />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}
