import { NextFunction, Request, Response } from "express";
import {
    IRegistAccountBody,
    IRegistAccountQuery
} from "../controllers";
import { TAccountRegisterMethod, validateAccountRegisterMethod, validateEmail, validateName, validatePassword } from "../data";

export const checkRegistBodyAndParams = async (request: Request<{}, {}, IRegistAccountBody, IRegistAccountQuery>, _response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod | undefined = request.query.method;
    await validateAccountRegisterMethod(method).catch(next);
    let isAllValid: boolean = false;
    switch (method) {
        case "manual":
            const { email, password, firstName, lastName } = request.body;
            await Promise.all([
                validateEmail(email),
                validatePassword(password),
                validateName(firstName, lastName)
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