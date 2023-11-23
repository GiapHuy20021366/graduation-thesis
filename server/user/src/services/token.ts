import { User } from "../db/model";
import { AccountExposed, AuthLike, InvalidDataError, ResourceNotExistedError, toAuthToken } from "../data";
import { verifyToken } from "../utils"

export const refreshToken = async (token: string, profile?: boolean): Promise<AccountExposed> => {
    const tokenInfo = verifyToken(token);
    if (tokenInfo == null || typeof tokenInfo === "string") {
        throw new InvalidDataError({
            message: "Token invalid",
            data: {
                target: "token",
                reason: "token-invalid"
            }
        })
    }

    const auth = tokenInfo.data as AuthLike;

    if (profile) {
        const user = await User.findOneByEmail(auth.email);
        if (user == null) {
            throw new ResourceNotExistedError({
                message: "User not existed",
                data: {
                    target: "user",
                    reason: "no-user-found"
                }
            })
        }
        return {
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            token: toAuthToken(user),
            avatar: user.avatar,
            titles: user.titles
        }
    } else {
        return {
            email: "",
            firstName: "",
            lastName: "",
            token: toAuthToken(auth)
        }
    }
}