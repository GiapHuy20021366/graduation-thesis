import axios from 'axios';
import { PROXY_URL, USER_PATH } from "../../env";

const userUrl = `${PROXY_URL}/${USER_PATH}`;

export const userInstance = axios.create({
    baseURL: userUrl,
    timeout: 2000
});

userInstance.interceptors.response.use(
    response => response.data,
    error => Promise.reject(error?.response?.data?.error)
);

interface AccountInfo {
    email: string;
    firstName: string;
    lastName: string;
    token: string;
}

interface ErrorResponse {
    code: number;
    msg: string;
}

interface AccountResponse {
    data?: AccountInfo;
    error?: ErrorResponse
}

interface MannualRegisterInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserFetcher {
    manualLogin(email: string, password: string): Promise<AccountResponse>;
    manualRegister(data: MannualRegisterInfo): Promise<AccountResponse>;
}

export const userFetcher: UserFetcher = {
    manualLogin: async (email: string, password: string): Promise<AccountResponse> => {
        return userInstance.post(
            '/login',
            {
                email,
                password
            },
            {
                params: {
                    method: "mannual"
                }
            })
    },
    manualRegister: async (data: MannualRegisterInfo): Promise<AccountResponse> => {
        return userInstance.post(
            '/register',
            data,
            {
                params: {
                    method: "mannual"
                }
            })
    },
};