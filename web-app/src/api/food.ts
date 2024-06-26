import axios, { AxiosError } from "axios";
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
  IPagination,
  Queried,
  IFoodResolved,
  Ided,
  Timed,
  Actived,
} from "../data";

export const foodEndpoints = {
  uploadImages: "/foods/images",
  uploadFood: "/foods",
  updateFood: "/foods/:id",
  getFoodPost: "/foods/:id",
  searchFood: "/foods/search",
  searchHistory: "/foods/search/history",
  likeFood: "/foods/:id/like",
  getLikedFood: "/foods/like/users/:userId",

  // personal
  favorite: "/foods/favorite/users/:userId",
  registerd: "/foods/register/users/:userId",
  resolveFood: "/foods/:id/resolve",
  activeFood: "/foods/:id/active",
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
  (error: AxiosError) => {
    const response = error.response;
    if (typeof response?.data === "object") {
      const data = response.data as ResponseLike<
        unknown,
        ResponseErrorLike<unknown, unknown>
      >;
      return Promise.reject(data.error);
    }
    const _error: ResponseErrorLike<unknown, unknown> = {
      code: response?.status ?? 500,
      message: "",
    };
    return Promise.reject(_error);
  }
);

export interface IPostFoodResponse
  extends Pick<
    IFoodPostExposed,
    "_id" | "createdAt" | "active" | "updatedAt"
  > {}

export interface IFoodSearchHistoryParams extends Queried {
  users?: string[];
}

export interface IFoodSearchHistoryExposed {
  userId: string;
  query: string;
}

export interface IFoodUserLike {
  user: string;
  foodPost: string;
}

export interface IFoodUserLikeExposed
  extends IFoodUserLike,
    Ided,
    Pick<Timed, "createdAt"> {}

export interface FoodFetcher {
  uploadImage(
    name: string,
    base64: string,
    auth: IAuthInfo
  ): Promise<FoodResponse<IImageExposed[]>>;
  uploadFood(
    data: IFoodUploadData,
    auth: IAuthInfo
  ): Promise<FoodResponse<IPostFoodResponse>>;
  updateFood(
    id: string,
    data: IFoodUploadData,
    auth: IAuthInfo
  ): Promise<FoodResponse<IPostFoodResponse>>;
  searchFood(
    data: IFoodSearchParams,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposed[]>>;
  getFoodPost(
    id: string,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposedWithLike>>;
  searchHistory(
    params: IFoodSearchHistoryParams,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodSearchHistoryExposed[]>>;
  likeFood(
    foodId: string,
    action: "LIKE" | "UNLIKE" | undefined,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposedWithLike | null>>;
  getLikedFood(
    userId: string,
    auth: IAuthInfo,
    pagination?: IPagination
  ): Promise<FoodResponse<IFoodPostExposedWithLike[]>>;

  getFavoriteFoods(
    userId: string,
    auth: IAuthInfo,
    pagination?: IPagination
  ): Promise<FoodResponse<IFoodPostExposed[]>>;

  getRegisteredFoods(
    userId: string,
    auth: IAuthInfo,
    pagination?: IPagination
  ): Promise<FoodResponse<IFoodPostExposed[]>>;

  resolveFood(
    foodId: string,
    auth: IAuthInfo,
    resolveBy?: string
  ): Promise<FoodResponse<Partial<IFoodResolved>>>;

  activeFood(
    foodId: string,
    auth: IAuthInfo,
    active?: boolean
  ): Promise<FoodResponse<Actived>>;
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
  ): Promise<FoodResponse<IPostFoodResponse>> => {
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
  ): Promise<FoodResponse<IPostFoodResponse>> => {
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
  getFoodPost: async (
    id: string,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodPostExposedWithLike>> => {
    return foodInstance.get(foodEndpoints.getFoodPost.replace(":id", id), {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  searchHistory: async (
    params: IFoodSearchHistoryParams,
    auth: IAuthInfo
  ): Promise<FoodResponse<IFoodSearchHistoryExposed[]>> => {
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
  ): Promise<FoodResponse<IFoodPostExposedWithLike | null>> => {
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
  getLikedFood: (
    userId: string,
    auth: IAuthInfo,
    pagination?: IPagination
  ): Promise<FoodResponse<IFoodPostExposedWithLike[]>> => {
    const params = new URLSearchParams();
    params.set("skip", String(pagination?.skip ?? 0));
    params.set("limit", String(pagination?.limit ?? 0));
    return foodInstance.get(
      foodEndpoints.getLikedFood.replace(":userId", userId) +
        "?" +
        params.toString(),
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },

  getFavoriteFoods: (
    userId: string,
    auth: IAuthInfo,
    pagination?: IPagination
  ): Promise<FoodResponse<IFoodPostExposed[]>> => {
    const params = new URLSearchParams();
    params.set("skip", String(pagination?.skip ?? 0));
    params.set("limit", String(pagination?.limit ?? 0));
    return foodInstance.get(
      foodEndpoints.favorite.replace(":userId", userId) +
        "?" +
        params.toString(),
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },

  getRegisteredFoods: (
    userId: string,
    auth: IAuthInfo,
    pagination?: IPagination
  ): Promise<FoodResponse<IFoodPostExposed[]>> => {
    const params = new URLSearchParams();
    params.set("skip", String(pagination?.skip ?? 0));
    params.set("limit", String(pagination?.limit ?? 0));
    return foodInstance.get(
      foodEndpoints.registerd.replace(":userId", userId) +
        "?" +
        params.toString(),
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },

  resolveFood: (
    foodId: string,
    auth: IAuthInfo,
    resolveBy?: string
  ): Promise<FoodResponse<Partial<IFoodResolved>>> => {
    const params = new URLSearchParams();
    if (resolveBy) {
      params.set("resolveBy", resolveBy);
    }
    return foodInstance.put(
      foodEndpoints.resolveFood.replace(":id", foodId) +
        "?" +
        params.toString(),
      {},
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },

  activeFood: (
    foodId: string,
    auth: IAuthInfo,
    active?: boolean
  ): Promise<FoodResponse<Actived>> => {
    const params = new URLSearchParams();
    params.set("active", active ? "true" : "false");
    return foodInstance.put(
      foodEndpoints.activeFood.replace(":id", foodId) + "?" + params.toString(),
      {},
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
};
