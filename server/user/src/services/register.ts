import { InvalidDataError, ResourceExistedError } from "../data";
import { User } from "../db/model";
import {
    USER_SERVICE
} from "../config";
import { operations, brokerChannel } from "../broker";
import { hashText, signToken, verifyToken } from "../utils";
import { toAuthToken } from "../data";


interface ManualAccountRegisterInfo {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const registAccountByManual = async (info: ManualAccountRegisterInfo): Promise<any> => {
    const account = await User.findOneByEmail(info.email);
    if (account !== null) {
        throw new ResourceExistedError({
            message: "Email already existed",
            data: {
                target: "email",
                reason: "email-existed"
            }
        });
    }

    const token = signToken({
        ...info,
        password: hashText(info.password)
    }, "1h");
    const message = JSON.stringify({
        email: info.email,
        operation: operations.mail.ACTIVE_MANUAL_ACCOUNT,
        token: token,
        from: USER_SERVICE
    });

    // send email to user
    await brokerChannel.toMessageServiceQueue(message);

    return {
        isSuccessful: true
    }

};

export const createManualAccountFromToken = async (token: string): Promise<any> => {
    const info = verifyToken(token) as ManualAccountRegisterInfo | null;
    if (info === null) {
        throw new InvalidDataError({
            message: "Token invalid",
            data: {
                target: "token",
                reason: "invalid-token"
            }
        });
    }

    const { email, firstName, lastName, password } = info;

    const account = await User.findOneByEmail(email);
    if (account !== null) {
        throw new ResourceExistedError({
            message: "Email already existed",
            data: {
                target: "email",
                reason: "email-existed"
            }
        });
    }

    const newAccount = await User.create({
        firstName,
        lastName,
        email,
        password
    });

    const dataToReturn = {
        firstName: newAccount.firstName,
        lastName: newAccount.lastName,
        email: newAccount.email,
        avatar: newAccount.avatar,
        titles: newAccount.titles,
        token: toAuthToken(newAccount)
    };

    return dataToReturn;
}