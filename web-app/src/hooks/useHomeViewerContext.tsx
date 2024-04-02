import { useContext } from "react";
import { HomeViewerContext } from "../app/home/HomeViewerContext";

export function useHomeViewerContext() {
  const context = useContext(HomeViewerContext);
  if (context === undefined) {
    throw new Error(
      "useHomeViewerContext must be used within a HomeViewerContextProvider"
    );
  }
  return context;
}
