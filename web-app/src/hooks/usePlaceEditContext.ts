import { useContext } from "react";
import { PlaceEditContext } from "../app/place/crud/PlaceEditContext";

export function usePlaceEditContext() {
  const context = useContext(PlaceEditContext);
  if (context === undefined) {
    throw new Error(
      "usePlaceEditContext must be used within a PlaceEditContextProvider"
    );
  }
  return context;
}
