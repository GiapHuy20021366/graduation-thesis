import { IFoodUpLoadLocation } from "./food-upload-data";
import { FoodCategory } from "./food-category";

export interface IFoodPostUser {
    _id: string;
    exposeName: string;
}
export interface IFoodSearchInfo {
    user: IFoodPostUser;
    images: string[];
    title: string;
    description: string;
    categories: FoodCategory[];
    location: IFoodUpLoadLocation;
    duration: number;
    count: number;
    quantity: number;
    price: number;
}

export const fakeOneFoodSearch = (): IFoodSearchInfo => {
    return {
        user: {
            _id: "Sample",
            exposeName: "GiapHuy1603",
        },
        images: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/6d/Good_Food_Display_-_NCI_Visuals_Online.jpg/800px-Good_Food_Display_-_NCI_Visuals_Online.jpg"],
        title: "Thực phẩm sạch cho mọi nhà",
        description: "",
        categories: [FoodCategory.FRUITS, FoodCategory.SALADS],
        price: 0,
        count: 30000,
        duration: Date.now(),
        location: {
            name: "Sample",
            coordinates: {
                lat: 23,
                lng: 46
            }
        },
        quantity: 5
    }
}