import { Route, Routes } from "react-router-dom";
import PageNotFound from "../common/PageNotFound";
import FoodSharingPage from "./sharing/FoodSharingPage";
import FoodSearchPage from "./search/FoodSearchPage";

export default function Food() {
  return (
    <Routes>
      <Route path="/" element={<FoodSharingPage />} />
      <Route path="/sharing" element={<FoodSharingPage />} />
      <Route path="/search" element={<FoodSearchPage />} />
      <Route path="*" element={<PageNotFound />} />
    </Routes>
  );
}
