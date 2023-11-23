import { NextFunction, Request, Response } from "express";
import {
    ILoginAccountBody,
    ILoginAccountQuery
} from "../controllers";
import { TAccountRegisterMethod, validateAccountRegisterMethod, validateEmail, validatePassword } from "../data";

export const checkLoginBodyAndParams = async (request: Request<{}, {}, ILoginAccountBody, ILoginAccountQuery>, _response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod | undefined = request.query.method;
    validateAccountRegisterMethod(method);
    let isAllValid: boolean = false;
    switch (method) {
        case "manual":
            const { email, password} = request.body;
            await Promise.all([
                validateEmail(email),
                validatePassword(password),
            ]).then((result) => {
                isAllValid = result.every(t => t);
            }).catch(next);
            break;
        case "google-oauth":
            next(new Error("Method not implemented"));
            break;
        case "facebook-oauth":
            next(new Error("Method not implemented"));
            break;
    }

    isAllValid && next();
}