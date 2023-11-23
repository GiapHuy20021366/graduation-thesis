import { signToken } from "../utils"
import { UserInfo } from "./user-info"

export const toAuthToken = (account: UserInfo): string => {
    return signToken({
        email: account.email
    })
}