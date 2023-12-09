import { signToken } from "../utils"

export interface AuthLike {
    email: string;
    _id: string;
}

export const toAuthToken = (auth: AuthLike): string => {
    return signToken({
        email: auth.email,
        _id: auth._id
    })
}