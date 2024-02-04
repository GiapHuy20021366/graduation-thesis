import { Route, Routes } from "react-router-dom";
import UsersAroundPage from "./users/UsersAroundPage";
import PageNotFound from "../common/PageNotFound";
import FoodAroundPage from "./food/FoodAroundPage";

export default function Arround() {
  return (
    <Routes>
      <Route path="/" element={<UsersAroundPage />} />
      <Route path="/users" element={<UsersAroundPage />} />
      <Route path="/food" element={<FoodAroundPage />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}
