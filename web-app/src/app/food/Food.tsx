import { Route, Routes } from "react-router-dom";
import FoodSharingPage from "./sharing/FoodSharingPage";
import FoodSearchPage from "./search/FoodSearchPage";
import FoodPost from "./post/FoodPost";
import FoodList from "./list/FoodList";
import FoodAroundPage from "./around/FoodAroundPage";

export default function Food() {
  return (
    <Routes>
      <Route path="/" element={<FoodList />} />
      <Route path="/sharing" element={<FoodSharingPage />} />
      <Route path="/search" element={<FoodSearchPage />} />
      <Route path="/around" element={<FoodAroundPage />} />
      <Route path="/:id" element={<FoodPost />} />
    </Routes>
  );
}
