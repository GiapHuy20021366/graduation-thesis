import { signToken } from "../utils"

export interface AuthLike {
    email: string;
}

export const toAuthToken = (auth: AuthLike): string => {
    return signToken({
        email: auth.email
    })
}