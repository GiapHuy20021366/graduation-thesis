import { NextFunction, Request, Response } from "express";
import {
    ILoginAccountBody,
    ILoginAccountQuery
} from "../controllers";
import { TAccountRegisterMethod, validateAccountRegisterMethod, validateEmail, validatePassword } from "../data";

export const checkLoginBodyAndParams = async (request: Request<{}, {}, ILoginAccountBody, ILoginAccountQuery>, _response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod | undefined = request.query.method;
    try {
        validateAccountRegisterMethod(method);
    } catch (error) {
        return next(error);
    }
    switch (method) {
        case "manual":
            const { email, password } = request.body;
            try {
                validateEmail(email);
                validatePassword(password);
            } catch (error) {
                return next(error);
            }
            break;
        case "google-oauth":
            return next(new Error("Method not implemented"));
        case "facebook-oauth":
            return next(new Error("Method not implemented"));
    }

    return next();
}