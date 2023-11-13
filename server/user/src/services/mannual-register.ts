import { InvalidDataError, ResourceExistedError } from "../data";
import { User } from "../db/model";
import {
    USER_SERVICE
} from "../config";
import { operations, brokerChannel } from "../broker";
import { hashText, signToken, verifyToken } from "../utils";


interface MannualAccountRegisterInfo {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const registAccountByMannual = async (info: MannualAccountRegisterInfo): Promise<any> => {
    const account = await User.findOneByEmail(info.email);
    if (account !== null) {
        throw new ResourceExistedError({
            message: "Email already existed"
        });
    }

    const token = signToken({
        ...info,
        password: hashText(info.password)
    }, "1h");
    const message = JSON.stringify({
        email: info.email,
        operation: operations.mail.ACTIVE_MANNUAL_ACCOUNT,
        token: token,
        from: USER_SERVICE
    });

    // send email to user
    await brokerChannel.toMessageServiceQueue(message);

    return {
        isSuccessful: true
    }

};

export const createMannualAccountFromToken = async (token: string): Promise<any> => {
    const info = verifyToken(token) as MannualAccountRegisterInfo | null;
    console.log(info);
    if (info === null) {
        throw new InvalidDataError({
            message: "Token invalid"
        });
    }

    const { email, firstName, lastName, password } = info;

    const account = await User.findOneByEmail(email);
    if (account !== null) {
        throw new ResourceExistedError({
            message: "Email already existed"
        });
    }

    const newAccount = await User.create({
        firstName,
        lastName,
        email,
        password
    });

    
    const dataToSignToken = {
        firstName: newAccount.firstName,
        lastName: newAccount.lastName,
        email: newAccount.email
    };
    // use for login
    const tempToken = signToken(dataToSignToken);
    
    const dataToReturn = {
        firstName: newAccount.firstName,
        lastName: newAccount.lastName,
        email: newAccount.email,
        token: tempToken
    };

    return dataToReturn;
}