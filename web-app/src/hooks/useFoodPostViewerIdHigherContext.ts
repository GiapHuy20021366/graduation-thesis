import { useContext } from "react";
import { FoodPostViewerIdHigherContext } from "../app/food/post/FoodPostViewerIdHigherContext";

export function useFoodPostViewerIdHigherContext() {
  const context = useContext(FoodPostViewerIdHigherContext);
  if (context === undefined) {
    throw new Error(
      "useFoodPostViewerIdHigherContext must be used within a FoodPostViewerIdHigherContextProvider"
    );
  }
  return context;
}
