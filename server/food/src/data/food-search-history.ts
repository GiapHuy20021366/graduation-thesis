import { IFoodSearchParams } from "./food-search-params";

export interface IFoodSearchHistory {
    userId: string;
    params: IFoodSearchParams;
}