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
    fakeOneFoodSearch,
    IFoodPostData,
    OrderState,
    FoodCategory
} from '../data';

export const foodEndpoints = {
    uploadImages: "/images/upload",
    uploadFood: "/foods/upload",
    findFoodPost: "/foods"
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
        console.log(params, auth);
        const data: IFoodSearchInfo[] = [];
        for (let i = 0; i < 64; ++i) {
            data.push(fakeOneFoodSearch());
        }
        return {
            data: data
        };
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