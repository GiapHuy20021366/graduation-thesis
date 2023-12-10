import { ICoordinates } from "./coordinates";
import { IImage } from "./image";

export interface IFoodPost {
    user: string;
    images: IImage[];
    createdAt: Date;
    updatedAt: Date;
    title: string;
    location: ICoordinates;
    categories: string[];
    description: string;
    quantity: number;
    duration: number;
    pickUpTimes: number;
}