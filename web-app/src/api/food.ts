import axios from "axios";
import { PROXY_URL, FOOD_PATH } from "../env";
import {
  ResponseLike,
  FoodErrorReason,
  FoodErrorTarget,
  ResponseErrorLike,
  IImageExposed,
  IAuthInfo,
  IFoodUploadData,
  IFoodPostExposed,
  IFoodPostExposedWithLike,
  IFoodSearchParams,
} from "../data";

export const foodEndpoints = {
  uploadImages: "/images",
  uploadFood: "/foods",
  updateFood: "/foods/:id",
  findFoodPost: "/foods/:id",
  searchFood: "/foods/search",
  searchHistory: "/foods/search/history",
  likeFood: "/foods/:id/like",
} as const;

export interface FoodResponseError
  extends ResponseErrorLike<FoodErrorTarget, FoodErrorReason> {}
export interface FoodResponse<DataLike>
  extends ResponseLike<DataLike, FoodResponseError> {}

const foodUrl = `${PROXY_URL}/${FOOD_PATH}`;

export const foodInstance = axios.create({
  baseURL: foodUrl,
  timeout: 2000,
});

foodInstance.interceptors.response.use(
  (response) => response.data,
  (error) => Promise.reject(error?.response?.data?.error)
);

export interface IFoodUploadResponseData {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  active: boolean;
}

export interface IFoodSearchHistoryParams {
  users?: string[];
  query?: string;
}

export interface IFoodSearchHistorySimple {
  userId: string;
  query: string;
}

export interface FoodFetcher {
  uploadImage(
    name: string,
    base64: string,
    auth: IAuthInfo
  ): Promise<FoodResponse<IImageExposed[]>>;
  uploadFood(
    data: IFoodUploadData,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodUploadResponseData>>;
  updateFood(
    id: string,
    data: IFoodUploadData,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodUploadResponseData>>;
  searchFood(
    data: IFoodSearchParams,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposed[]>>;
  findFoodPost(
    id: string,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposedWithLike>>;
  searchHistory(
    params: IFoodSearchHistoryParams,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodSearchHistorySimple[]>>;
  likeFood(
    foodId: string,
    action: "LIKE" | "UNLIKE" | undefined,
    auth: IAuthInfo
  ): Promise<FoodResponse<void>>;
}

export const foodFetcher: FoodFetcher = {
  uploadImage: async (
    name: string,
    base64: string,
    auth: IAuthInfo
  ): Promise<FoodResponse<IImageExposed[]>> => {
    return foodInstance.post(
      foodEndpoints.uploadImages,
      {
        images: [{ name, base64 }],
      },
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  uploadFood: async (
    data: IFoodUploadData,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodUploadResponseData>> => {
    return foodInstance.post(foodEndpoints.uploadFood, data, {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  updateFood: async (
    id: string,
    data: IFoodUploadData,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodUploadResponseData>> => {
    return foodInstance.put(foodEndpoints.updateFood.replace(":id", id), data, {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  searchFood: async (
    params: IFoodSearchParams,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposed[]>> => {
    return foodInstance.post(foodEndpoints.searchFood, params, {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  findFoodPost: async (
    id: string,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposedWithLike>> => {
    return foodInstance.get(foodEndpoints.findFoodPost.replace(":id", id), {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  searchHistory: async (
    params: IFoodSearchHistoryParams,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodSearchHistorySimple[]>> => {
    return foodInstance.post(foodEndpoints.searchHistory, params, {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  likeFood: (
    foodId: string,
    action: "LIKE" | "UNLIKE" | undefined,
    auth: IAuthInfo
  ): Promise<FoodResponse<void>> => {
    return foodInstance.put(
      foodEndpoints.likeFood.replace(":id", foodId),
      {
        action: action ?? "LIKE",
      },
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
};
