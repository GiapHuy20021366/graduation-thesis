import { ResourceExistedError } from "../data";
import { User } from "../db/model";
import {
    MESSAGE_SERVICE,
    USER_SERVICE
} from "../config";
import { operations, publishMessage } from "../broker";
import { signToken } from "../utils";


interface MannualAccountRegisterInfo {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}

interface MannualRegisterResult {
    isSuccessful: boolean;
}

export const registAccountByMannual = async (info: MannualAccountRegisterInfo): Promise<MannualRegisterResult> => {
    const account = await User.findOneByEmail(info.email);
    if (account !== null) {
        throw new ResourceExistedError({
            message: "Email already existed"
        });
    }

    const token = signToken(info, "1h");
    const message = JSON.stringify({
        email: info.email,
        operation: operations.mail.ACTIVE_MANNUAL_ACCOUNT,
        token: token,
        from: USER_SERVICE
    });

    // send email to user
    await publishMessage(MESSAGE_SERVICE, message);

    return {
        isSuccessful: true
    }

};