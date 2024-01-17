import { Route, Routes } from "react-router-dom";
import UsersArroundPage from "./users/UsersArroundPage";
import PageNotFound from "../common/PageNotFound";

export default function Arround() {
  return (
    <Routes>
      <Route path="/" element={<UsersArroundPage />} />
      <Route path="/users" element={<UsersArroundPage />} />
      <Route path="/*" element={<PageNotFound />} />
    </Routes>
  );
}
