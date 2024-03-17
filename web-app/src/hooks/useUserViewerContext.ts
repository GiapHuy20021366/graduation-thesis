import { useContext } from "react";
import { UserViewerContext } from "../app/user/viewer/UserViewerContext";

export function useUserViewerContext() {
  const context = useContext(UserViewerContext);
  if (context === undefined) {
    throw new Error(
      "useUserViewerContext must be used within a UserViewerContextProvider"
    );
  }
  return context;
}
