import { useContext } from "react";
import { ToastContext } from "../app/ToastContext";

export function useToastContext() {
    const context = useContext(ToastContext);
    if (context === undefined) {
        throw new Error(
            "useToastContext must be used within a ToastContextProvider"
        );
    }
    return context;
}
