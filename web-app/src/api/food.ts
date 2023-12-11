import axios from 'axios';
import {
    PROXY_URL,
    FOOD_PATH
} from "../env";
import {
    ResponseLike,
    FoodErrorReason,
    FoodErrorTarget,
    ResponseErrorLike,
    IImageExposed,
    IAuthInfo,
    ICoordinates
} from '../data';

export const foodEndpoints = {
    uploadImages: "/images/upload",
    uploadFood: "/foods/upload"
} as const;

export interface FoodResponseError extends ResponseErrorLike<FoodErrorTarget, FoodErrorReason> { }
export interface FoodResponse<DataLike> extends ResponseLike<DataLike, FoodResponseError> { }

const foodUrl = `${PROXY_URL}/${FOOD_PATH}`;

export const foodInstance = axios.create({
    baseURL: foodUrl,
    timeout: 2000
});

foodInstance.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error?.response?.data?.error)
);

interface IFoodUploadData {
    images: string[];
    title: string;
    location: ICoordinates;
    categories: string[];
    description: string;
    quantity: number;
    duration: number;
    pickUpTimes: number;
    cost: number;
}

interface IFoodUploadResponseData {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface FoodFetcher {
    uploadImage(name: string, base64: string, auth: IAuthInfo): Promise<FoodResponse<IImageExposed[]>>;
    uploadFood(data: IFoodUploadData, auth: IAuthInfo): Promise<FoodResponse<IFoodUploadResponseData>>;
}

export const foodFetcher: FoodFetcher = {
    uploadImage: async (name: string, base64: string, auth: IAuthInfo): Promise<FoodResponse<IImageExposed[]>> => {
        return foodInstance.post(
            foodEndpoints.uploadImages,
            {
                images: [
                    { name, base64 }
                ]
            },
            {
                headers: {
                    Authorization: auth.token
                }
            })
    },
    uploadFood: async (data: IFoodUploadData, auth: IAuthInfo): Promise<FoodResponse<IFoodUploadResponseData>> => {
        return foodInstance.post(
            foodEndpoints.uploadFood,
            data,
            {
                headers: {
                    Authorization: auth.token
                }
            }
        )
    }
};