import { useContext } from "react";
import { AuthenticationContext } from "../app/AuthContext";

export function useAuthContext() {
    const context = useContext(AuthenticationContext);
    if (context === undefined) {
        throw new Error(
            "useAuthContext must be used within a AuthContextProvider"
        );
    }
    return context;
}
