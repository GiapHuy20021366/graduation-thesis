import { NextFunction, Request, Response } from "express";
import {
    InvalidDataError,
    TAccountRegisterMethod,
    toResponseSuccessData,
} from "../data";
import { createMannualAccountFromToken, registAccountByMannual } from "../services";
import { verifyToken } from "~/utils";

export interface IRegistAccountBody {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export interface IRegistAccountQuery {
    method?: TAccountRegisterMethod;
}

export const registAccount = async (request: Request<{}, {}, IRegistAccountBody, IRegistAccountQuery>, response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod = request.query.method!;
    switch (method) {
        case "mannual":
            const { email, password, firstName, lastName } = request.body;
            await registAccountByMannual({
                email: email!,
                password: password!,
                firstName: firstName!,
                lastName: lastName!
            }).then((result) => {
                return response.status(200).json(toResponseSuccessData(result));
            }).catch(next);
            break;
        case "google-oauth":

        case "facebook-oauth":
            next(new Error("Method not implemented"));
            break;

    }
}

export interface IActiveMannualAccountQuery {
    token?: string
}

export const activeMannualAccount = async (request: Request<{}, {}, {}, IActiveMannualAccountQuery>, response: Response, next: NextFunction) => {
    const token = request.query.token;
    if (token === undefined) {
        return next(new InvalidDataError({
            message: "Token not found"
        }));
    }

    await createMannualAccountFromToken(token).then((result) => {
        return response.status(200).json(toResponseSuccessData(result));
    }).catch(next);
}

