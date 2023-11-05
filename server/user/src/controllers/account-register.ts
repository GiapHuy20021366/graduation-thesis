import { NextFunction, Request, Response } from "express";
import {
    TAccountRegisterMethod,
} from "../data";
import { registAccountByMannual } from "../services";

export interface IRequestAccountParams { }

export interface IResponseAccountBody { }

export interface IRequestAccountBody {
    email?: string;
    password?: string;
    firstName?: string;
    lastName?: string;
}

export interface IRequestAccountQuery {
    method?: TAccountRegisterMethod;
}

export const registAccount = async (request: Request<IRequestAccountParams, IResponseAccountBody, IRequestAccountBody, IRequestAccountQuery>, response: Response, next: NextFunction) => {
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
                return response.status(200).json(result);
            }).catch(next);
            break;
        case "google-oauth":

        case "facebook-oauth":

    }
}


