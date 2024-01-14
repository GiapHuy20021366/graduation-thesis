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
    IFoodUploadData,
    IFoodSearchInfo,
    IFoodPostData,
    OrderState,
    FoodCategory,
    ItemAddedBy,
    ItemAvailable,
    IPagination,
    ICoordinates
} from '../data';

export const foodEndpoints = {
    uploadImages: "/images/upload",
    uploadFood: "/foods/upload",
    findFoodPost: "/foods",
    searchFood: "/foods/search"
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

interface IFoodUploadResponseData {
    _id: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface IFoodSearchPrice {
    min: number;
    max: number;
    active: boolean;
}

export interface IFoodSeachOrder {
    orderDistance: OrderState;
    orderNew: OrderState;
    orderPrice: OrderState;
    orderQuantity: OrderState;
}
export interface IFoodSearchParams {
    order: IFoodSeachOrder;
    maxDistance: number;
    query: string;
    categories: FoodCategory[];
    maxDuration: number;
    price: IFoodSearchPrice;
    minQuantity: number;
    addedBy: ItemAddedBy;
    available: ItemAvailable;
    pagination?: IPagination;
    currentLocation?: ICoordinates;
}

export interface FoodFetcher {
    uploadImage(name: string, base64: string, auth: IAuthInfo): Promise<FoodResponse<IImageExposed[]>>;
    uploadFood(data: IFoodUploadData, auth: IAuthInfo): Promise<FoodResponse<IFoodUploadResponseData>>;
    searchFood(data: IFoodSearchParams, auth: IAuthInfo): Promise<FoodResponse<IFoodSearchInfo[]>>;
    findFoodPost(id: string, auth: IAuthInfo): Promise<FoodResponse<IFoodPostData>>;
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
    },
    searchFood: async (params: IFoodSearchParams, auth: IAuthInfo): Promise<FoodResponse<IFoodSearchInfo[]>> => {
        return foodInstance.post(
            foodEndpoints.searchFood,
            params,
            {
                headers: {
                    Authorization: auth.token
                }
            }
        )
    },
    findFoodPost: async (id: string, auth: IAuthInfo): Promise<FoodResponse<IFoodPostData>> => {
        return foodInstance.get(
            `${foodEndpoints.findFoodPost}/${id}`,
            {
                headers: {
                    Authorization: auth.token
                }
            }
        )
    }
};