import { DurationType, UnitType } from ".";
import { ICoordinates } from "./coordinates";
import { FoodCategory } from "./food-category";
import { IFoodUploadCost, IFoodUploadDuration, IFoodUpoadCount } from "./food-upload-data";

export interface IFoodSearchInfo {
    userId: string;
    images: string[];
    title: string;
    description: string;
    categories: FoodCategory[];
    location: ICoordinates;
    duration: IFoodUploadDuration;
    count: IFoodUpoadCount;
    quantity: number;
    cost: IFoodUploadCost;
}

export const fakeOneFoodSearch = (): IFoodSearchInfo => {
    return {
        userId: "GiapHuy1603",
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg"],
        title: "Thực phẩm sạch cho mọi nhà",
        description: "",
        categories: [FoodCategory.FRUITS, FoodCategory.SALADS],
        cost: {
            value: 0,
            unit: "VNĐ"
        },
        count: {
            value: 1,
            unit: UnitType.PIECE
        },
        duration: {
            value: 2,
            unit: DurationType.DAY
        },
        location: {
            lat: 23,
            lng: 46
        },
        quantity: 5
    }
}