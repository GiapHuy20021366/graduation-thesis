import { User } from "../db/model";
import { AccountExposed, AuthLike, ResourceNotExistedError, toAuthToken } from "../data";

export const refreshToken = async (auth: AuthLike, profile?: boolean): Promise<AccountExposed> => {
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