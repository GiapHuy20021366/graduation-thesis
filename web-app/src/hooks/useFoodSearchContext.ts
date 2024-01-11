import { useContext } from "react";
import { FoodSearchContext } from "../app/food/search/FoodSearchContext";

export function useFoodSearchContext() {
    const context = useContext(FoodSearchContext);
    if (context === undefined) {
        throw new Error(
            "useFoodSearchContext must be used within a FoodSearchContextProvider"
        );
    }
    return context;
}
