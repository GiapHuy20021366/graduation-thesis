import axios, { AxiosError } from "axios";
import { PROXY_URL, USER_PATH } from "../env";
import {
  ResponseLike,
  UserErrorReason,
  UserErrorTarget,
  ResponseErrorLike,
  IPagination,
  ICoordinates,
  IAuthInfo,
  ILocation,
  PlaceType,
  IPlaceExposed,
  FollowType,
  IRating,
  IPlaceFollowerExposed,
  IUserSearchParams,
  IUserExposedWithFollower,
  IFollowerSearchParams,
  IUserFollowerExposed,
  IUserExposedSimple,
  IPersonalDataUpdate,
  IFollowerExposed,
  Paginationed,
  IPlaceSearchParams,
  IPlaceExposedWithRatingAndFollow,
  Followed,
} from "../data";

export const userEndpoints = {
  // users
  signin: "/users/login",
  signup: "/users/register",
  refeshToken: "/users/token/refresh",
  activeManual: "/users/active",
  getUserInfo: "/users/:id",
  searchUser: "/users/search",
  followUser: "/users/:id/follow",
  updatePersonal: "/users/:id",
  getUserFollowers: "/users/:id/subcribe/search",
  getUsersAndPlacesFollowed: "/users/:id/follow/search",

  // places
  createPlace: "/places",
  updatePlace: "/places/:id",
  activePlace: "/places/:id/active",
  followPlace: "/places/:id/follow",
  searchPlace: "/places/search",
  ratingPlace: "/places/:id/rating",
  getPlace: "/places/:id",
  getPlaceByFollow: "/places/follow/users/:userId",
  getRankPlaceByFavorite: "/places/rank/favorite",
  getRatedPlaces: "/places/rating/users/:userId",
  getPlaceFollowers: "/places/:id/subcribe/search",
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
  (error: AxiosError) => {
    const response = error.response;
    if (typeof response?.data === "object") {
      const data = response.data as ResponseLike<
        unknown,
        ResponseErrorLike<unknown, unknown>
      >;
      return Promise.reject(data);
    }
    const _error: ResponseErrorLike<unknown, unknown> = {
      code: response?.status ?? 500,
      message: "",
    };
    return Promise.reject(_error);
  }
);

interface AccountInfo {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  token: string;
  categories: string[];
  avatar?: string;
  location?: ILocation;
}

interface ManualRegisterInfo {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface IGetUserNearParams extends Paginationed {
  coordinate: ICoordinates;
  maxDistance: number;
}

export interface IPlaceData {
  exposedName: string;
  description?: string;
  categories: string[];
  location: ILocation;
  avatar?: string;
  images: string[];
  type: PlaceType;
}

export interface IGetPlacesByFollowParams extends Paginationed {
  followTypes?: FollowType[];
  placeTypes?: PlaceType[];
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
  ): Promise<UserResponse<IUserExposedSimple[]>>;
  getSimpleUser(
    id: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedSimple>>;
  getDetailUser(
    userId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedWithFollower>>;
  setLocation(
    userId: string,
    location: ILocation,
    auth: IAuthInfo
  ): Promise<UserResponse<void>>;
  searchUser(
    params: IUserSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedSimple[]>>;
  followUser(
    userId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserFollowerExposed>>;
  unFollowUser(
    userId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserFollowerExposed>>;
  updatePersonalData(
    userId: string,
    data: IPersonalDataUpdate,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedSimple>>;
  getUserFollowers(
    user: string,
    params: IFollowerSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserFollowerExposed[]>>;
  getUsersAndPlacesFollowed(
    user: string,
    params: IFollowerSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IFollowerExposed[]>>;

  // Place
  createPlace(
    data: IPlaceData,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>>;
  getPlace(
    placeId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposedWithRatingAndFollow>>;
  updatePlace(
    placeId: string,
    data: IPlaceData,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed>>;
  activePlace(
    placeId: string,
    active: boolean,
    auth: IAuthInfo
  ): Promise<UserResponse<{ active: boolean }>>;
  followPlace(
    placeId: string,
    followType: FollowType,
    auth: IAuthInfo
  ): Promise<UserResponse<Followed>>;
  unFollowPlace(
    placeId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<Followed>>;
  ratingPlace(
    placeId: string,
    auth: IAuthInfo,
    score?: number | null
  ): Promise<UserResponse<IRating>>;
  searchPlace(
    searchParams: IPlaceSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed[]>>;
  getPlacesByFollow(
    user: string,
    params: IGetPlacesByFollowParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed[]>>;
  getRankPlaceByFavorite(
    pagination: IPagination,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed[]>>;
  getRatedPlace(
    user: string,
    pagination: IPagination,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposedWithRatingAndFollow[]>>;
  getPlaceFollowers(
    place: string,
    params: IFollowerSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceFollowerExposed[]>>;
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
  ): Promise<UserResponse<IUserExposedSimple[]>> => {
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
  getSimpleUser: (
    id: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedSimple>> => {
    return userInstance.get(userEndpoints.getUserInfo.replace(":id", id), {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  getDetailUser: (
    id: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedWithFollower>> => {
    const params = new URLSearchParams();
    params.set("detail", "true");
    return userInstance.get(
      userEndpoints.getUserInfo.replace(":id", id) + "?" + params.toString(),
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  setLocation: (
    userId: string,
    location: ILocation,
    auth: IAuthInfo
  ): Promise<UserResponse<void>> => {
    const data: IPersonalDataUpdate = {
      updated: {
        location: location,
      },
    };
    return userInstance.put(
      userEndpoints.updatePersonal.replace(":id", userId),
      data,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  searchUser: (
    params: IUserSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedSimple[]>> => {
    return userInstance.post(userEndpoints.searchUser, params, {
      headers: {
        Authorization: auth.token,
      },
    });
  },
  followUser: (
    userId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserFollowerExposed>> => {
    const params = new URLSearchParams();
    params.set("action", "follow");
    return userInstance.put(
      userEndpoints.followUser.replace(":id", userId) + "?" + params.toString(),
      {},
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  unFollowUser: (
    userId: string,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserFollowerExposed>> => {
    const params = new URLSearchParams();
    params.set("action", "unfollow");
    return userInstance.put(
      userEndpoints.followUser.replace(":id", userId) + "?" + params.toString(),
      {},
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  updatePersonalData: (
    userId: string,
    data: IPersonalDataUpdate,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserExposedSimple>> => {
    return userInstance.put(
      userEndpoints.updatePersonal.replace(":id", userId),
      data,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  getUserFollowers: (
    user: string,
    params: IFollowerSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IUserFollowerExposed[]>> => {
    return userInstance.post(
      userEndpoints.getUserFollowers.replace(":id", user),
      params,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  getUsersAndPlacesFollowed: (
    user: string,
    params: IFollowerSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IFollowerExposed[]>> => {
    return userInstance.post(
      userEndpoints.getUsersAndPlacesFollowed.replace(":id", user),
      params,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
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
  ): Promise<UserResponse<IPlaceExposedWithRatingAndFollow>> => {
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
  ): Promise<UserResponse<{ active: boolean }>> => {
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
  ): Promise<UserResponse<Followed>> => {
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
  ): Promise<UserResponse<Followed>> => {
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
    score?: number | null
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
  getPlacesByFollow: (
    user: string,
    params: IGetPlacesByFollowParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed[]>> => {
    return userInstance.post(
      userEndpoints.getPlaceByFollow.replace(":userId", user),
      params,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  getRankPlaceByFavorite: (
    pagination: IPagination,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposed[]>> => {
    const params = new URLSearchParams();
    params.set("skip", String(pagination.skip));
    params.set("limit", String(pagination.limit));

    return userInstance.get(
      userEndpoints.getRankPlaceByFavorite + "?" + params.toString(),
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  getRatedPlace: (
    user: string,
    pagination: IPagination,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceExposedWithRatingAndFollow[]>> => {
    const params = new URLSearchParams();
    params.set("skip", String(pagination.skip));
    params.set("limit", String(pagination.limit));

    return userInstance.get(
      userEndpoints.getRatedPlaces.replace(":userId", user) +
        "?" +
        params.toString(),
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
  getPlaceFollowers: (
    place: string,
    params: IFollowerSearchParams,
    auth: IAuthInfo
  ): Promise<UserResponse<IPlaceFollowerExposed[]>> => {
    return userInstance.post(
      userEndpoints.getPlaceFollowers.replace(":id", place),
      params,
      {
        headers: {
          Authorization: auth.token,
        },
      }
    );
  },
};

const fakeOneUser = (params: IGetUserNearParams): IUserExposedSimple => {
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
    _id: String(Math.random() * 1000000),
    location: {
      name: "Fake",
      coordinates: userCoor,
    },
    active: true,
    exposedName: "",
  };
};
