import { Route, Routes } from "react-router-dom";
import FoodSharingPage from "./sharing/FoodSharingPage";
import FoodSearchPage from "./search/FoodSearchPage";
import FoodPost from "./post/FoodPost";

export default function Food() {
  return (
    <Routes>
      <Route path="/" element={<FoodSharingPage />} />
      <Route path="/sharing" element={<FoodSharingPage />} />
      <Route path="/search" element={<FoodSearchPage />} />
      <Route path="/:id" element={<FoodPost />} />
    </Routes>
  );
}
