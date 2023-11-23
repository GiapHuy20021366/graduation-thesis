import { ResourceNotExistedError, UnauthorizationError, toAuthToken } from "../data";
import { User } from "../db/model";
import { compareHash } from "../utils";

interface IAccountLoginInfo {
    email: string;
    firstName: string;
    lastName: string;
    titles?: string[];
    avatar?: string;
    token: string;
}

export const loginAccountByManual = async (email: string, password: string): Promise<IAccountLoginInfo> => {
    const user = await User.findOneByEmail(email);
    if (user == null) {
        throw new ResourceNotExistedError({
            message: `No account with email ${email} found`,
            data: {
                targetLabel: "email",
                reason: "NO_EMAIL_FOUND"
            }
        })
    }

    if (!compareHash(password, user.password)) {
        throw new UnauthorizationError({
            message: "Incorrect password",
            data: {
                targetLabel: "password",
                reason: "INCORRECT_PASSWORD"
            }
        });
    }

    return {
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        token: toAuthToken(user),
        avatar: user.avatar,
        titles: user.titles
    }
}