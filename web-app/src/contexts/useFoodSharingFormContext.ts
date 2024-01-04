import { useContext } from "react";
import { FoodSharingFormContext } from "./FoodSharingFormContext";

export function useFoodSharingFormContext() {
    const context = useContext(FoodSharingFormContext);
    if (context === undefined) {
        throw new Error(
            "useFoodSharingFormContext must be used within a FoodSharingFormContextProvider"
        );
    }
    return context;
}