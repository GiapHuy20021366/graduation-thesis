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
} from "../data";

export const userEndpoints = {
  signin: "/login",
  signup: "/register",
  refeshToken: "/token/refresh",
  activeManual: "/active",
  userNear: "/users/near",
  getInfo: "/info", // :id,
  setLocation: "/location",
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
    id_: "fake",
    location: {
      name: "Fake",
      coordinates: userCoor,
    },
  };
};
