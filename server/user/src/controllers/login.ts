import { NextFunction, Request, Response } from "express";
import {
    TAccountRegisterMethod,
    toResponseSuccessData,
} from "../data";
import { loginAccountByManual } from "../services";

export interface ILoginAccountBody {
    email?: string;
    password?: string;
}

export interface ILoginAccountQuery {
    method?: TAccountRegisterMethod;
}

export const loginAccount = async (request: Request<{}, {}, ILoginAccountBody, ILoginAccountQuery>, response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod = request.query.method!;
    switch (method) {
        case "manual":
            const { email, password } = request.body;
            await loginAccountByManual(email!, password!).then((result) => {
                return response.status(200).json(toResponseSuccessData(result));
            }).catch(next);
            break;
        case "google-oauth":
            next(new Error("Method not implemented"));
            break;
        case "facebook-oauth":
            next(new Error("Method not implemented"));
            break;

    }
}
