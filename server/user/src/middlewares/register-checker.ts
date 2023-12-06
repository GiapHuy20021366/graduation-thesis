import { NextFunction, Request, Response } from "express";
import {
    IRegistAccountBody,
    IRegistAccountQuery
} from "../controllers";
import { InvalidDataError, TAccountRegisterMethod, validateAccountRegisterMethod, validateEmail, validateName, validatePassword } from "../data";

export const checkRegistBodyAndParams = async (request: Request<{}, {}, IRegistAccountBody, IRegistAccountQuery>, _response: Response, next: NextFunction) => {
    const method: TAccountRegisterMethod | undefined = request.query.method;
    try {
        validateAccountRegisterMethod(method)
    } catch (error) {
        return next(error);
    }
    switch (method) {
        case "manual":
            const { email, password, firstName, lastName } = request.body;
            try {
                validateEmail(email);
                validatePassword(password);
                validateName(firstName, lastName);
            } catch (error) {
                return next(error);
            }
            break;
        case "google-oauth":
            const cridential = request.body.cridential;
            if (cridential == null) {
                return next(
                    new InvalidDataError({
                        message: "Cridential not found",
                        data: {
                            target: "cridential",
                            reason: "cridential-not-found"
                        }
                    })
                )
            }
            break;
        case "facebook-oauth":
            return next(new Error("Method not implemented"));
    }

    return next();
}