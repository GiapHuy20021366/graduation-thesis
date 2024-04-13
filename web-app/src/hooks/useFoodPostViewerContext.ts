import { useContext } from "react";
import { FoodPostViewerContext } from "../app/food/post/FoodPostViewerContext";

export function useFoodPostViewerContext() {
  const context = useContext(FoodPostViewerContext);
  if (context === undefined) {
    throw new Error(
      "useFoodPostViewerContext must be used within a FoodPostViewerContextProvider"
    );
  }
  return context;
}
