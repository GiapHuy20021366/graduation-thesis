import { useContext } from "react";
import { AppCacheContext } from "../app/AppCacheContext";

export function useAppCacheContext() {
  const context = useContext(AppCacheContext);
  if (context === undefined) {
    throw new Error(
      "useAppCacheContext must be used within a AppCacheDataContextProvider"
    );
  }
  return context;
}
