import { useContext } from "react";
import { PageProgessContext } from "../app/PageProgessContext";

export function usePageProgessContext() {
    const context = useContext(PageProgessContext);
    if (context === undefined) {
        throw new Error(
            "usePageProgessContext must be used within a PageProgessContextProvider"
        );
    }
    return context;
}
