import { ICoordinates } from "./coordinates";

export interface IFoodPostUser {
    _id: string;
    exposeName: string;
}

export interface IFoodPostLocation {
    name: string;
    coordinates: ICoordinates;
    two_array?: number[];
}

export interface IFoodPost {
    user: IFoodPostUser;
    images: string[];
    title: string;
    location: IFoodPostLocation;
    categories: string[];
    description: string;
    quantity: number;
    duration: Date;
    price: number;
}