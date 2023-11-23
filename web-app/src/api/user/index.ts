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
    titles: string[];
    avartar?: string;
}

interface ErrorResponse {
    code: number;
    msg: string;
    data?: {
        target: string;
        reason: string;
    }
}

interface AccountResponse {
    data?: AccountInfo;
    error?: ErrorResponse
}

interface ManualRegisterInfo {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

export interface UserFetcher {
    manualLogin(email: string, password: string): Promise<AccountResponse>;
    manualRegister(data: ManualRegisterInfo): Promise<AccountResponse>;
    refreshToken(token: string, profile?: boolean): Promise<AccountResponse>;
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
                    method: "manual"
                }
            })
    },
    manualRegister: async (data: ManualRegisterInfo): Promise<AccountResponse> => {
        return userInstance.post(
            '/register',
            data,
            {
                params: {
                    method: "manual"
                }
            })
    },
    refreshToken: async (token: string, profile?: boolean): Promise<AccountResponse> => {
        return userInstance.get(
            '/token/refresh',
            {
                params: {
                    profile
                },
                headers: {
                    Authorization: token
                }
            })
    },
};

export const userErrorTargets = {
    EMAIL: "email",
    METHOD: "method",
    PASSWORD: "password",
    FIRST_NAME: "firstName",
    LAST_NAME: "lastName",
    TOKEN: "token",
    ACCOUNT: "account"
} as const;

export const userErrorReasons = {
    INVALID_METHOD: "invalid-method",
    EMPTY_EMAIL: "empty-email",
    INVALID_EMAIL_FORMAT: "invalid-email-format",
    EMPTY_PASSWORD: "empty-password",
    INVALID_PASSWORD_LENGTH: "invalid-password-length",
    INVALID_PASSWORD_CHARACTER_UPPER: "invalid-password-character-upper",
    INVALID_PASSWORD_CHARACTER_LOWER: "invalid-password-character-lower",
    INVALID_PASSWORD_CHARACTER_DIGIT: "invalid-password-character-digit",
    EMPTY_FIRST_NAME: "empty-first-name",
    EMPTY_LAST_NAME: "empty-last-name",
    NO_EMAIL_FOUND: "no-email-found",
    INCORRECT_PASSWORD: "incorrect-password",
    EMAIL_EXISTED: "email-existed",
    INVALID_TOKEN: "invalid-token",
    NO_ACCOUNT_FOUND: "no-account-found"
} as const;