import { useContext } from "react";
import { AuthenticationContext } from "../contexts/AuthenticationContext";

export function useAuthenticationContext() {
    const context = useContext(AuthenticationContext);
    if (context === undefined) {
        throw new Error(
            "useAuthenticationContext must be used within a AuthenticationContextProvider"
        );
    }
    return context;
}
