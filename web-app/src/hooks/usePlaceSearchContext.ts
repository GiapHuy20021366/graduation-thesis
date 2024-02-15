import { useContext } from "react";
import { PlaceSearchContext } from "../app/place/search/PlaceSearchContext";

export function usePlaceSearchContext() {
  const context = useContext(PlaceSearchContext);
  if (context === undefined) {
    throw new Error(
      "usePlaceSearchContext must be used within a PlaceSearchContextProvider"
    );
  }
  return context;
}
