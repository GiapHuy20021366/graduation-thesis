import { ICoordinates } from "~/data";
import { FoodPost } from "../db/model";

interface IPostFoodData {
    user: string;
    title: string;
    location: ICoordinates;
    categories: string[];
    description: string;
    quantity: number;
    duration: number;
    pickupTimes: number;
    cost: number;
    images: string[];
}

interface IPostFoodReturn {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export const postFood = async (data: IPostFoodData): Promise<IPostFoodReturn> => {
    const foodPost = new FoodPost(data);
    await foodPost.save();
    return {
        _id: foodPost._id,
        createdAt: foodPost.createdAt,
        updatedAt: foodPost.updatedAt,
    }
} 