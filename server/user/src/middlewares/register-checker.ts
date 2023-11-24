import { NextFunction, Request, Response } from "express";
import {
    IRegistAccountBody,
    IRegistAccountQuery
} from "../controllers";
import { InvalidDataError, TAccountRegisterMethod, validateAccountRegisterMethod, validateEmail, validateName, validatePassword } from "../data";

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
            isAllValid = true;
            break;
        case "facebook-oauth":
            next(new Error("Method not implemented"));
            break;
    }

    isAllValid && next();
}