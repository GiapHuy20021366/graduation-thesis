import { useContext } from "react";
import { I18nContext } from "./I18nContext";

export function useLanguageContext() {
    const context = useContext(I18nContext);
    if (context === undefined) {
        throw new Error(
            "useLanguageContext must be used within a I18nContextProvider"
        );
    }
    return context;
}
