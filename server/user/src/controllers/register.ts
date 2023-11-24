import { NextFunction, Request, Response } from "express";
import {
    InvalidDataError,
    TAccountRegisterMethod,
    toResponseSuccessData,
} from "../data";
import { createManualAccountFromToken, registAccountByGoogleCridential, registAccountByManual } from "../services";

export interface IRegistAccountBody {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
    cridential?: string;
}

export interface IRegistAccountQuery {
    method?: TAccountRegisterMethod;
}

export const registAccount = async (request: Request<{}, {}, IRegistAccountBody, IRegistAccountQuery>, response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod = request.query.method!;
    switch (method) {
        case "manual":
            const { email, password, firstName, lastName } = request.body;
            await registAccountByManual({
                email: email!,
                password: password!,
                firstName: firstName!,
                lastName: lastName!
            }).then((result) => {
                return response.status(200).json(toResponseSuccessData(result));
            }).catch(next);
            break;
        case "google-oauth":
            await registAccountByGoogleCridential(request.body.cridential!).then((result) => {
                return response.status(200).json(toResponseSuccessData(result));
            }).catch(next);
            break;
        case "facebook-oauth":
            next(new Error("Method not implemented"));
            break;

    }
}

export interface IActiveManualAccountQuery {
    token?: string
}

export const activeManualAccount = async (request: Request<{}, {}, {}, IActiveManualAccountQuery>, response: Response, next: NextFunction) => {
    const token = request.query.token;
    if (token === undefined) {
        return next(new InvalidDataError({
            message: "Token not found",
            data: {
                target: "token",
                reason: "TOKEN_NOT_FOUND"
            }
        }));
    }

    await createManualAccountFromToken(token).then((result) => {
        return response.status(200).json(toResponseSuccessData(result));
    }).catch(next);
}

