import { useContext } from "react";
import { I18nContext } from "./I18nContext";

export function useI18nContext() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error(
            "useI18nContext must be used within a I18nContextProvider"
        );
    }
    return context;
}
