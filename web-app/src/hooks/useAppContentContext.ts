import { useContext } from "react";
import { AppContentContext } from "../app/AppContentContext";

export function useAppContentContext() {
    const context = useContext(AppContentContext);
    if (context === undefined) {
        throw new Error(
            "useAppContentContext must be used within a AppContentContextProvider"
        );
    }
    return context;
}
