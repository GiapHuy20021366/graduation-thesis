import axios from 'axios';
import {
    PROXY_URL,
    USER_PATH
} from "../env";
import {
    ResponseLike,
    UserErrorReason,
    UserErrorTarget,
    ResponseErrorLike
} from '../data';

export const userEndpoints = {
    signin: "/login",
    signup: "/register",
    refeshToken: "/token/refresh",
    activeManual: "/active"
} as const;

export interface UserResponseError extends ResponseErrorLike<UserErrorTarget, UserErrorReason> {}
export interface UserResponse<DataLike> extends ResponseLike<DataLike, UserResponseError> {}

const userUrl = `${PROXY_URL}/${USER_PATH}`;

export const userInstance = axios.create({
    baseURL: userUrl,
    timeout: 2000
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

export interface UserFetcher {
    manualLogin(email: string, password: string): Promise<UserResponse<AccountInfo>>;
    manualRegister(data: ManualRegisterInfo): Promise<UserResponse<AccountInfo>>;
    refreshToken(token: string, profile?: boolean): Promise<UserResponse<AccountInfo>>;
    googleOAuthLogin(cridential: string): Promise<UserResponse<AccountInfo>>;
    activeMannualAccount(token: string): Promise<UserResponse<AccountInfo>>;
}

export const userFetcher: UserFetcher = {
    manualLogin: async (email: string, password: string): Promise<UserResponse<AccountInfo>> => {
        return userInstance.post(
            userEndpoints.signin,
            {
                email,
                password
            },
            {
                params: {
                    method: "manual"
                }
            })
    },
    manualRegister: async (data: ManualRegisterInfo): Promise<UserResponse<AccountInfo>> => {
        return userInstance.post(
            userEndpoints.signup,
            data,
            {
                params: {
                    method: "manual"
                }
            })
    },
    refreshToken: async (token: string, profile?: boolean): Promise<UserResponse<AccountInfo>> => {
        return userInstance.get(
            userEndpoints.refeshToken,
            {
                params: {
                    profile
                },
                headers: {
                    Authorization: token
                }
            })
    },
    googleOAuthLogin: async (cridential: string): Promise<UserResponse<AccountInfo>> => {
        return userInstance.post(
            userEndpoints.signup,
            {
                cridential
            },
            {
                params: {
                    method: "google-oauth"
                }
            })
    },
    activeMannualAccount: async (token: string): Promise<UserResponse<AccountInfo>> => {
        return userInstance.post(
            userEndpoints.activeManual,
            {},
            {
                params: {
                    token
                }
            })
    }
};