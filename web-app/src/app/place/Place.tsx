import { Route, Routes } from "react-router-dom";
import PlaceList from "./list/PlaceList";
import PlaceCRUD from "./crud/PlaceCRUD";
import PlaceViewerPage from "./viewer/PlaceViewerPage";
import PlaceSearch from "./search/PlaceSearch";
import PlaceSearchContextProvider from "./search/PlaceSearchContext";

export default function Place() {
  return (
    <Routes>
      <Route path="/" element={<PlaceList />} />
      <Route path="/:id" element={<PlaceViewerPage />} />
      <Route path="/update" element={<PlaceCRUD />} />
      <Route
        path="/search"
        element={
          <PlaceSearchContextProvider>
            <PlaceSearch />
          </PlaceSearchContextProvider>
        }
      />
    </Routes>
  );
}
