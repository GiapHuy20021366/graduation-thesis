import { Route, Routes } from "react-router-dom";
import PlaceList from "./list/PlaceList";
import PlaceViewer from "./viewer/PlaceViewer";
import PlaceCRUD from "./crud/PlaceCRUD";

export default function Place() {
  return (
    <Routes>
      <Route path="/" element={<PlaceList />} />
      <Route path="/:id" element={<PlaceViewer />} />
      <Route path="/update" element={<PlaceCRUD />} />
    </Routes>
  );
}
