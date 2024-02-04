import axios from "axios";
import { PROXY_URL, USER_PATH } from "../env";
import {
  ResponseLike,
  UserErrorReason,
  UserErrorTarget,
  ResponseErrorLike,
  IPagination,
  ICoordinates,
  IAuthInfo,
  IUserInfo,
  ILocation,
  PlaceType,
  IPlaceExposed,
  FollowType,
  IPlaceFollower,
  IRating,
  OrderState,
} from "../data";

export const userEndpoints = {
  signin: "/login",
  signup: "/register",
  refeshToken: "/token/refresh",
  activeManual: "/active",
  userNear: "/users/near",
  getInfo: "/info", // :id,
  setLocation: "/location",

  // places
  createPlace: "/places",
  updatePlace: "/places/:id",
  activePlace: "/places/:id/active",
  followPlace: "/places/:id/follow",
  ratingPlace: "/places/:id/rating",
  getPlace: "/places/:id",
  searchPlace: "/places/search",
} as const;

export interface UserResponseError
  extends ResponseErrorLike<UserErrorTarget, UserErrorReason> {}
export interface UserResponse<DataLike>
  extends ResponseLike<DataLike, UserResponseError> {}

const userUrl = `${PROXY_URL}/${USER_PATH}`;

export const userInstance = axios.create({
  baseURL: userUrl,
  timeout: 2000,
});

userInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const errInfo = error?.response?.data?.error;
    if (errInfo != null) return Promise.reject(errInfo);
    else Promise.reject(error);
  }
);

interface AccountInfo {
  id_: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  titles: string[];
  avartar?: string;
}

interface ManualRegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IGetUserNearParams {
  pagination?: IPagination;
  coordinate: ICoordinates;
  maxDistance: number;
}

export interface IPlaceData {
  exposeName: string;
  description?: string;
  categories: string[];
  location: ILocation;
  avartar?: string;
  images: string[];
  type: PlaceType;
}

export interface IPlaceSearchOrder {
  distance?: OrderState;
  rating?: OrderState;
}

export interface IPlaceSearchParams {
  query?: string;
  author?: string;
  maxDistance?: number;
  minRating?: number;
  order?: IPlaceSearchOrder;
  currentLocation?: ICoordinates;
  pagination?: IPagination;
  types?: PlaceType[];
}

export interface UserFetcher {
  manualLogin(
    email: string,
    password: string
  ): Promise<UserResponse<AccountInfo>>;
  manualRegister(data: ManualRegisterInfo): Promise<UserResponse<AccountInfo>>;
  refreshToken(
    token: string,
    profile?: boolean
  ): Promise<UserResponse<AccountInfo>>;
  googleOAuthLogin(cridential: string): Promise<UserResponse<AccountInfo>>;
  activeMannualAccount(token: string): Promise<UserResponse<AccountInfo>>;
  getUsersNear(
    params: IGetUserNearParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserInfo[]>>;
  getUserInfo(id: string, auth: IAuthInfo): Promise<UserResponse<IUserInfo>>;
  setLocation(
    location: ILocation,
    auth: IAuthInfo
  ): Promise<UserResponse<void>>;

  // Place
  createPlace(
    data: IPlaceData,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>>;
  getPlace(
    placeId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>>;
  updatePlace(
    placeId: string,
    data: IPlaceData,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>>;
  activePlace(
    placeId: string,
    active: boolean,
    auth: IAuthInfo
  ): Promise<UserResponse<boolean>>;
  followPlace(
    placeId: string,
    followType: FollowType,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceFollower>>;
  unFollowPlace(
    placeId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<{ unfollow: boolean }>>;
  ratingPlace(
    placeId: string,
    auth: IAuthInfo,
    score?: number
  ): Promise<UserResponse<IRating>>;
  searchPlace(
    searchParams: IPlaceSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed[]>>;
}

export const userFetcher: UserFetcher = {
  manualLogin: async (
    email: string,
    password: string
  ): Promise<UserResponse<AccountInfo>> => {
    return userInstance.post(
      userEndpoints.signin,
      {
        email,
        password,
      },
      {
        params: {
          method: "manual",
        },
      }
    );
  },
  manualRegister: async (
    data: ManualRegisterInfo
  ): Promise<UserResponse<AccountInfo>> => {
    return userInstance.post(userEndpoints.signup, data, {
      params: {
        method: "manual",
      },
    });
  },
  refreshToken: async (
    token: string,
    profile?: boolean
  ): Promise<UserResponse<AccountInfo>> => {
    return userInstance.get(userEndpoints.refeshToken, {
      params: {
        profile,
      },
      headers: {
        Authorization: token,
      },
    });
  },
  googleOAuthLogin: async (
    cridential: string
  ): Promise<UserResponse<AccountInfo>> => {
    return userInstance.post(
      userEndpoints.signup,
      {
        cridential,
      },
      {
        params: {
          method: "google-oauth",
        },
      }
    );
  },
  activeMannualAccount: async (
    token: string
  ): Promise<UserResponse<AccountInfo>> => {
    return userInstance.post(
      userEndpoints.activeManual,
      {},
      {
        params: {
          token,
        },
      }
    );
  },
  getUsersNear: async (
    params: IGetUserNearParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserInfo[]>> => {
    console.log(params, auth);
    const data = [];
    const limit = params.pagination?.limit ?? 50;
    for (let i = 0; i < limit; ++i) {
      data.push(fakeOneUser(params));
    }
    return {
      data: data,
    };
  },
  getUserInfo: (
    id: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserInfo>> => {
    return userInstance.get(`${userEndpoints.getInfo}/${id}`, {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  setLocation: (
    location: ILocation,
    auth: IAuthInfo
  ): Promise<UserResponse<void>> => {
    return userInstance.put(userEndpoints.setLocation, location, {
      headers: {
        Authorization: auth.token,
      },
    });
  },

  // place
  createPlace: (
    data: IPlaceData,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>> => {
    return userInstance.post(userEndpoints.createPlace, data, {
      headers: {
        Authorization: auth.token,
      },
    });
  },

  getPlace: (
    placeId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>> => {
    return userInstance.get(userEndpoints.getPlace.replace(":id", placeId), {
      headers: {
        Authorization: auth.token,
      },
    });
  },

  updatePlace: (
    placeId: string,
    data: IPlaceData,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>> => {
    return userInstance.put(
      userEndpoints.updatePlace.replace(":id", placeId),
      data,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  activePlace: (
    placeId: string,
    active: boolean,
    auth: IAuthInfo
  ): Promise<UserResponse<boolean>> => {
    return userInstance.get(
      userEndpoints.activePlace.replace(":id", placeId) +
        `?active=${active ? "true" : "false"}`,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  followPlace: (
    placeId: string,
    followType: FollowType,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceFollower>> => {
    return userInstance.get(
      userEndpoints.followPlace.replace(":id", placeId) +
        `?action=follow&type=${followType}`,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  unFollowPlace: (
    placeId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<{ unfollow: boolean }>> => {
    return userInstance.get(
      userEndpoints.followPlace.replace(":id", placeId) + `?action=unfollow`,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  ratingPlace: (
    placeId: string,
    auth: IAuthInfo,
    score?: number
  ): Promise<UserResponse<IRating>> => {
    return userInstance.get(
      userEndpoints.ratingPlace.replace(":id", placeId) +
        `?score=${score ?? ""}`,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  searchPlace: (
    searchParams: IPlaceSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed[]>> => {
    return userInstance.post(userEndpoints.searchPlace, searchParams, {
      headers: {
        Authorization: auth.token,
      },
    });
  },
};

const fakeOneUser = (params: IGetUserNearParams): IUserInfo => {
  const center = params.coordinate;
  const deltaLat = Math.min(0.01, Math.random() / 100);
  const isPlusLat = Math.random() > 0.5;
  const deltaLng = Math.min(0.01, Math.random() / 100);
  const isPlusLng = Math.random() > 0.5;
  const userCoor: ICoordinates = {
    lat: center.lat + (isPlusLat ? deltaLat : -deltaLat),
    lng: center.lng + (isPlusLng ? deltaLng : -deltaLng),
  };

  return {
    email: "something@gmail.com",
    firstName: "A",
    lastName: "B",
    id_: String(Math.random() * 1000000),
    location: {
      name: "Fake",
      coordinates: userCoor,
    },
  };
};
